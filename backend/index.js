import express from 'express'
import cors from 'cors'
import axios from 'axios'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Logging
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`)
}

// Almacenamiento temporal de órdenes
const orders = new Map()
let qvapayToken = null
let tokenExpiry = null

// Credenciales de QvaPay (email y contraseña de tu cuenta)
const QVAPAY_EMAIL = process.env.QVAPAY_EMAIL
const QVAPAY_PASSWORD = process.env.QVAPAY_PASSWORD
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://funny-eclair-1ada5a.netlify.app'
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`

// ============ OBTENER TOKEN DE QVAPAY ============
const getQvaPayToken = async () => {
  if (qvapayToken && tokenExpiry && Date.now() < tokenExpiry) {
    return qvapayToken
  }
  try {
    log('🔑 Obteniendo token de QvaPay...')
    const response = await axios.post('https://api.qvapay.com/auth/login', {
      email: QVAPAY_EMAIL,
      password: QVAPAY_PASSWORD,
    })
    qvapayToken = response.data.token || response.data.access_token
    tokenExpiry = Date.now() + 7200000 // 2 horas
    log(`✅ Token obtenido`)
    return qvapayToken
  } catch (error) {
    log(`❌ Error obteniendo token: ${error.response?.data?.message || error.message}`, 'error')
    throw new Error('No se pudo autenticar con QvaPay')
  }
}

// ============ CREAR FACTURA EN QVAPAY (con varios endpoints) ============
const createQvaPayInvoice = async (payload, token) => {
  const endpoints = [
    'https://api.qvapay.com/v1/charges',
    'https://api.qvapay.com/v2/invoice',
    'https://api.qvapay.com/invoice'
  ]
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  for (const endpoint of endpoints) {
    try {
      const response = await axios.post(endpoint, payload, { headers, timeout: 10000 })
      const data = response.data.data || response.data
      const id = data.id || data.invoice_id || data.charge_id
      const url = data.url || data.payment_url || data.checkout_url
      if (id && url) {
        return { id, url }
      }
    } catch (error) {
      // Continúa con el siguiente endpoint
    }
  }
  throw new Error('Ningún endpoint de QvaPay funcionó')
}

// ============ ENDPOINTS DE TU API ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Crear orden
app.post('/api/create-order', (req, res) => {
  try {
    const { items, total, customer } = req.body
    if (!items || !total || !customer) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
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
    log(`❌ Error: ${error.message}`, 'error')
    res.status(500).json({ success: false, error: error.message })
  }
})

// Endpoint REAL (con token)
app.post('/api/payment/qvapay/create-invoice', async (req, res) => {
  try {
    const { orderId, amount, customerEmail, customerName } = req.body
    if (!orderId || !amount || !customerEmail) {
      return res.status(400).json({ success: false, error: 'Faltan datos' })
    }

    const order = orders.get(orderId)
    if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' })

    if (!QVAPAY_EMAIL || !QVAPAY_PASSWORD) {
      throw new Error('Credenciales QvaPay no configuradas')
    }

    const token = await getQvaPayToken()

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

    const { id: invoiceId, url: invoiceUrl } = await createQvaPayInvoice(payload, token)

    order.qvapayInvoiceId = invoiceId
    order.qvapayInvoiceUrl = invoiceUrl
    orders.set(orderId, order)

    log(`✅ Factura creada: ${invoiceId}`)
    res.json({ success: true, invoiceUrl, invoiceId })

  } catch (error) {
    log(`❌ Error: ${error.message}`, 'error')
    res.status(500).json({ success: false, error: error.message })
  }
})

// Endpoint de PRUEBA (simula QvaPay)
app.post('/api/payment/qvapay/create-invoice-test', async (req, res) => {
  try {
    const { orderId, amount, customerEmail } = req.body
    const order = orders.get(orderId)
    if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' })

    log(`🧪 [TEST] Simulando pago para orden ${orderId}`)
    order.status = 'paid'
    order.paidAt = new Date().toISOString()
    orders.set(orderId, order)

    res.json({
      success: true,
      invoiceUrl: `${FRONTEND_URL}/checkout/success?order=${orderId}&test=true`,
      invoiceId: `TEST-${orderId}`,
      testMode: true
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Webhook de QvaPay
app.post('/api/webhook/qvapay', (req, res) => {
  const data = req.body
  const invoiceId = data.invoice_id || data.id || data.charge_id
  if (invoiceId) {
    for (const [orderId, order] of orders.entries()) {
      if (order.qvapayInvoiceId === invoiceId) {
        order.status = 'paid'
        order.paidAt = new Date().toISOString()
        orders.set(orderId, order)
        log(`✅ Orden ${orderId} pagada por webhook`)
        break
      }
    }
  }
  res.json({ received: true })
})

// Estado de orden
app.get('/api/payment/status/:orderId', (req, res) => {
  const order = orders.get(req.params.orderId)
  if (!order) return res.status(404).json({ success: false, error: 'Orden no encontrada' })
  res.json({ success: true, status: order.status, paidAt: order.paidAt })
})

// Iniciar servidor
app.listen(PORT, () => {
  log(`🚀 Servidor en puerto ${PORT}`)
  log(`📦 Frontend: ${FRONTEND_URL}`)
  log(`🔗 Backend: ${BACKEND_URL}`)
  log(`💳 QvaPay: ${QVAPAY_EMAIL ? 'Configurado' : 'No configurado'}`)
})