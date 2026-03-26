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

// Almacenamiento temporal de órdenes (en producción usa base de datos)
const orders = new Map()

// ============ CONFIGURACIÓN QVAPAY ============
const QVAPAY_APP_ID = process.env.QVAPAY_APP_ID
const QVAPAY_APP_SECRET = process.env.QVAPAY_APP_SECRET
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://funny-eclair-1ada5a.netlify.app'
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`

// Headers para QvaPay
const qvapayHeaders = {
  'app-id': QVAPAY_APP_ID,
  'app-secret': QVAPAY_APP_SECRET,
  'Content-Type': 'application/json'
}

// ============ ENDPOINTS ============

// Health check - útil para Render
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    qvapayConfigured: !!(QVAPAY_APP_ID && QVAPAY_APP_SECRET)
  })
})

// Crear orden
app.post('/api/create-order', (req, res) => {
  try {
    const { items, total, customer } = req.body
    
    // Validación básica
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
    
    log(`Orden creada: ${orderId} - Total: $${total}`)
    
    res.json({ success: true, orderId })
    
  } catch (error) {
    log(`Error al crear orden: ${error.message}`, 'error')
    res.status(500).json({ success: false, error: error.message })
  }
})

// Crear factura en QvaPay
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
    
    // Verificar que la orden existe
    const order = orders.get(orderId)
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: `Orden ${orderId} no encontrada` 
      })
    }
    
    // Verificar credenciales
    if (!QVAPAY_APP_ID || !QVAPAY_APP_SECRET) {
      log('❌ Credenciales QvaPay no configuradas', 'error')
      return res.status(500).json({ 
        success: false, 
        error: 'Configuración de pagos incompleta. Contacta al administrador.' 
      })
    }
    
    log(`📝 Creando factura para orden ${orderId} - Monto: $${amount}`)
    
    // Preparar payload para QvaPay
    const payload = {
      amount: Number(amount),
      currency: 'USD',
      description: `Pedido ${orderId} - DulceEncanto`,
      customer_email: customerEmail,
      customer_name: customerName || 'Cliente',
      redirect_url: `${FRONTEND_URL}/checkout/success?order=${orderId}`,
      webhook_url: `${BACKEND_URL}/api/webhook/qvapay`,
      expiration_minutes: 60
    }
    
    log(`📤 Enviando a QvaPay: ${JSON.stringify(payload)}`)
    
    // Intentar crear factura
    const response = await axios.post(
      'https://api.qvapay.com/v2/invoice', 
      payload, 
      { headers: qvapayHeaders, timeout: 10000 }
    )
    
    // Verificar respuesta
    if (!response.data) {
      throw new Error('QvaPay no devolvió datos')
    }
    
    // Extraer datos (puede venir en data o directamente)
    const invoiceData = response.data.data || response.data
    const invoiceId = invoiceData.id || invoiceData.invoice_id
    const invoiceUrl = invoiceData.url || invoiceData.payment_url
    
    if (!invoiceId || !invoiceUrl) {
      log(`⚠️ Respuesta inesperada de QvaPay: ${JSON.stringify(response.data)}`, 'error')
      throw new Error('QvaPay devolvió respuesta incompleta')
    }
    
    // Guardar referencia
    order.qvapayInvoiceId = invoiceId
    order.qvapayInvoiceUrl = invoiceUrl
    orders.set(orderId, order)
    
    log(`✅ Factura creada: ${invoiceId} - URL: ${invoiceUrl}`)
    
    res.json({
      success: true,
      invoiceUrl: invoiceUrl,
      invoiceId: invoiceId
    })
    
  } catch (error) {
    // Manejo detallado de errores
    log(`❌ Error al crear factura:`, 'error')
    
    if (error.response) {
      // Error de QvaPay
      log(`Status: ${error.response.status}`, 'error')
      log(`Data: ${JSON.stringify(error.response.data)}`, 'error')
      
      // Mensaje amigable según el error
      let userMessage = 'Error al procesar el pago'
      if (error.response.status === 401) {
        userMessage = 'Error de autenticación con QvaPay. Contacta al administrador.'
      } else if (error.response.status === 422) {
        userMessage = 'Datos de pago inválidos. Verifica el monto y los datos.'
      } else if (error.response.status === 429) {
        userMessage = 'Demasiadas solicitudes. Intenta en unos segundos.'
      }
      
      res.status(error.response.status).json({ 
        success: false, 
        error: userMessage,
        details: process.env.NODE_ENV === 'development' ? error.response.data : undefined
      })
    } else if (error.request) {
      // No hubo respuesta
      log(`No response from QvaPay: ${error.message}`, 'error')
      res.status(503).json({ 
        success: false, 
        error: 'El servicio de pagos no está disponible. Intenta más tarde.' 
      })
    } else {
      // Error local
      log(`Local error: ${error.message}`, 'error')
      res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }
  }
})

// Webhook para confirmar pagos
app.post('/api/webhook/qvapay', async (req, res) => {
  try {
    const webhookData = req.body
    log(`📨 Webhook recibido: ${JSON.stringify(webhookData)}`)
    
    // QvaPay puede enviar el invoice_id en diferentes formatos
    const invoiceId = webhookData.invoice_id || webhookData.id || webhookData.data?.id
    
    if (invoiceId) {
      // Buscar orden por invoiceId
      let orderFound = false
      for (const [orderId, order] of orders.entries()) {
        if (order.qvapayInvoiceId === invoiceId) {
          order.status = 'paid'
          order.paidAt = new Date().toISOString()
          orders.set(orderId, order)
          orderFound = true
          log(`✅ Orden ${orderId} pagada correctamente`)
          break
        }
      }
      
      if (!orderFound) {
        log(`⚠️ Webhook recibido para invoice ${invoiceId} pero no se encontró orden asociada`)
      }
    } else {
      log(`⚠️ Webhook sin invoice_id: ${JSON.stringify(webhookData)}`)
    }
    
    // Siempre responder 200 para que QvaPay no reintente
    res.json({ received: true })
    
  } catch (error) {
    log(`❌ Error en webhook: ${error.message}`, 'error')
    // Aún así respondemos 200 para evitar reintentos
    res.json({ received: true, error: error.message })
  }
})

// Verificar estado de orden
app.get('/api/payment/status/:orderId', (req, res) => {
  const order = orders.get(req.params.orderId)
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      error: 'Orden no encontrada' 
    })
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
  log(`💳 QvaPay configurado: ${QVAPAY_APP_ID ? '✅ Sí' : '❌ No'}`)
})