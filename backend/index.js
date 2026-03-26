import express from 'express'
import cors from 'cors'
import axios from 'axios'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Logging simple
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`)
}

// Almacenamiento temporal
const orders = new Map()
let qvapayToken = null
let tokenExpiry = null

// ============ CONFIGURACIÓN ============
const QVAPAY_EMAIL = process.env.QVAPAY_EMAIL
const QVAPAY_PASSWORD = process.env.QVAPAY_PASSWORD
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://funny-eclair-1ada5a.netlify.app'
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`

// ============ FUNCIÓN PARA OBTENER TOKEN DE QVAPAY ============
const getQvaPayToken = async () => {
  // Si el token existe y no ha expirado (2 horas = 7200000 ms), reutilizarlo
  if (qvapayToken && tokenExpiry && Date.now() < tokenExpiry) {
    log('♻️ Usando token existente')
    return qvapayToken
  }

  try {
    log('🔑 Obteniendo nuevo token de QvaPay...')

    const response = await axios.post('https://api.qvapay.com/auth/login', {
      email: QVAPAY_EMAIL,
      password: QVAPAY_PASSWORD
    })

    qvapayToken = response.data.token || response.data.access_token
    tokenExpiry = Date.now() + 7200000 // 2 horas

    log(`✅ Token obtenido: ${qvapayToken.substring(0, 20)}...`)
    return qvapayToken

  } catch (error) {
    log(`❌ Error al obtener token: ${error.response?.data?.message || error.message}`, 'error')
    throw new Error('No se pudo autenticar con QvaPay')
  }
}

// ============ ENDPOINTS ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    qvapayConfigured: !!(QVAPAY_EMAIL && QVAPAY_PASSWORD)
  })
})

// Crear orden
app.post('/api/create-order', (req, res) => {
  try {
    const { items, total, customer } = req.body

    if (!items || !total || !customer) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos'
      })
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    orders.set(orderId, {
      id: orderId,
      items,
      total,
      customer,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    log(`✅ Orden creada: ${orderId} - $${total}`)
    res.json({ success: true, orderId })

  } catch (error) {
    log(`❌ Error al crear orden: ${error.message}`, 'error')
    res.status(500).json({ success: false, error: error.message })
  }
})

// ============ ENDPOINT REAL DE QVAPAY (Bearer Token) ============
app.post('/api/payment/qvapay/create-invoice', async (req, res) => {
  try {
    const { orderId, amount, customerEmail, customerName } = req.body

    // Validaciones
    if (!orderId || !amount || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos: orderId, amount, customerEmail son requeridos'
      })
    }

    const order = orders.get(orderId)
    if (!order) {
      return res.status(404).json({ success: false, error: `Orden ${orderId} no encontrada` })
    }

    // Verificar credenciales
    if (!QVAPAY_EMAIL || !QVAPAY_PASSWORD) {
      log('❌ Credenciales QvaPay no configuradas', 'error')
      return res.status(500).json({
        success: false,
        error: 'Configuración de pagos incompleta'
      })
    }

    log(`📝 Creando factura real para orden ${orderId} - $${amount}`)

    // Obtener token
    const token = await getQvaPayToken()

    // Intentar con el endpoint más común
    const endpoints = [
      'https://api.qvapay.com/v1/charges',
      'https://api.qvapay.com/v2/invoice',
      'https://api.qvapay.com/invoice'
    ]

    let lastError = null

    for (const endpoint of endpoints) {
      try {
        log(`📤 Probando endpoint: ${endpoint}`)

        const payload = {
          amount: Number(amount),
          currency: 'USD',
          description: `Pedido ${orderId} - DulceEncanto`,
          customer_email: customerEmail,
          customer_name: customerName || 'Cliente',
          success_url: `${FRONTEND_URL}/checkout/success?order=${orderId}`,
          cancel_url: `${FRONTEND_URL}/checkout/cancel`,
          webhook_url: `${BACKEND_URL}/api/webhook/qvapay`
        }

        const response = await axios.post(endpoint, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        })

        // Si llegamos aquí, el endpoint funcionó
        const invoiceData = response.data.data || response.data
        const invoiceId = invoiceData.id || invoiceData.invoice_id || invoiceData.charge_id
        const invoiceUrl = invoiceData.url || invoiceData.payment_url || invoiceData.checkout_url

        if (invoiceId && invoiceUrl) {
          order.qvapayInvoiceId = invoiceId
          order.qvapayInvoiceUrl = invoiceUrl
          orders.set(orderId, order)

          log(`✅ Factura creada: ${invoiceId} - ${invoiceUrl}`)

          return res.json({
            success: true,
            invoiceUrl: invoiceUrl,
            invoiceId: invoiceId
          })
        }

      } catch (error) {
        lastError = error
        log(`⚠️ Endpoint ${endpoint} falló: ${error.response?.status || error.message}`)
        // Continuar con el siguiente endpoint
      }
    }

    // Si ningún endpoint funcionó
    throw lastError || new Error('No se pudo crear la factura con ningún endpoint')

  } catch (error) {
    log(`❌ Error al crear factura: ${error.message}`, 'error')

    if (error.response) {
      log(`Status: ${error.response.status}`, 'error')
      log(`Data: ${JSON.stringify(error.response.data)}`, 'error')
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar el pago. Intenta más tarde.'
    })
  }
})

// ============ ENDPOINT DE PRUEBA (Simula QvaPay) ============
app.post('/api/payment/qvapay/create-invoice-test', async (req, res) => {
  try {
    const { orderId, amount, customerEmail, customerName } = req.body

    const order = orders.get(orderId)
    if (!order) {
      return res.status(404).json({ success: false, error: `Orden ${orderId} no encontrada` })
    }

    log(`🧪 [TEST] Simulando pago para orden ${orderId} - $${amount}`)

    const fakeInvoiceId = `TEST-${orderId}-${Date.now()}`
    const fakeInvoiceUrl = `${FRONTEND_URL}/checkout/success?order=${orderId}&test=true`

    // Marcar como pagada automáticamente en modo prueba
    order.status = 'paid'
    order.paidAt = new Date().toISOString()
    order.qvapayInvoiceId = fakeInvoiceId
    order.qvapayInvoiceUrl = fakeInvoiceUrl
    orders.set(orderId, order)

    res.json({
      success: true,
      invoiceUrl: fakeInvoiceUrl,
      invoiceId: fakeInvoiceId,
      testMode: true,
      message: '⚠️ MODO PRUEBA - No se realizó ningún cargo real'
    })

  } catch (error) {
    log(`❌ Error en modo prueba: ${error.message}`, 'error')
    res.status(500).json({ success: false, error: error.message })
  }
})

// Webhook para confirmar pagos
app.post('/api/webhook/qvapay', async (req, res) => {
  try {
    const webhookData = req.body
    log(`📨 Webhook recibido: ${JSON.stringify(webhookData)}`)

    const invoiceId = webhookData.invoice_id || webhookData.id || webhookData.charge_id

    if (invoiceId) {
      for (const [orderId, order] of orders.entries()) {
        if (order.qvapayInvoiceId === invoiceId) {
          order.status = 'paid'
          order.paidAt = new Date().toISOString()
          orders.set(orderId, order)
          log(`✅ Orden ${orderId} pagada correctamente`)
          break
        }
      }
    }

    res.json({ received: true })

  } catch (error) {
    log(`❌ Error en webhook: ${error.message}`, 'error')
    res.json({ received: true })
  }
})

// Verificar estado
app.get('/api/payment/status/:orderId', (req, res) => {
  const order = orders.get(req.params.orderId)

  if (!order) {
    return res.status(404).json({ success: false, error: 'Orden no encontrada' })
  }

  res.json({
    success: true,
    status: order.status,
    paidAt: order.paidAt || null,
    total: order.total
  })
})

// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
  log(`🚀 Servidor corriendo en puerto ${PORT}`)
  log(`📦 Frontend URL: ${FRONTEND_URL}`)
  log(`🔗 Backend URL: ${BACKEND_URL}`)
  log(`💳 QvaPay configurado: ${QVAPAY_EMAIL ? '✅ Sí' : '❌ No'}`)
  log(`🧪 Endpoint de prueba: ${BACKEND_URL}/api/payment/qvapay/create-invoice-test`)
})