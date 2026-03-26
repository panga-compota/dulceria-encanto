const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

// Configuración QvaPay - las pondremos en variables de entorno
const QVAPAY_APP_ID = process.env.QVAPAY_APP_ID
const QVAPAY_APP_SECRET = process.env.QVAPAY_APP_SECRET
const QVAPAY_BASE_URL = 'https://api.qvapay.com'

// Almacenamiento temporal de órdenes (en memoria)
// En producción con más ventas, usarías una base de datos
const orders = new Map()

// ============ ENDPOINTS ============

// Crear orden
app.post('/api/create-order', async (req, res) => {
  try {
    const { items, total, customer } = req.body
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    orders.set(orderId, {
      id: orderId,
      items,
      total,
      customer,
      status: 'pending',
      createdAt: new Date().toISOString()
    })
    
    res.json({ success: true, orderId })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Crear factura en QvaPay
app.post('/api/payment/qvapay/create-invoice', async (req, res) => {
  try {
    const { orderId, amount, customerEmail, customerName } = req.body
    
    const order = orders.get(orderId)
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }
    
    // Headers de autenticación
    const headers = {
      'app-id': QVAPAY_APP_ID,
      'app-secret': QVAPAY_APP_SECRET,
      'Content-Type': 'application/json'
    }
    
    // Crear factura en QvaPay
    const response = await axios.post(`${QVAPAY_BASE_URL}/v2/invoice`, {
      amount: amount,
      currency: 'USD',
      description: `Pedido ${orderId} - DulceEncanto`,
      customer_email: customerEmail,
      customer_name: customerName,
      redirect_url: `${process.env.FRONTEND_URL}/checkout/success?order=${orderId}`,
      webhook_url: `${process.env.BACKEND_URL}/api/webhook/qvapay`,
      expiration_minutes: 60
    }, { headers })
    
    const invoice = response.data
    
    // Guardar referencia
    order.qvapayInvoiceId = invoice.id
    order.qvapayInvoiceUrl = invoice.url
    orders.set(orderId, order)
    
    res.json({
      success: true,
      invoiceUrl: invoice.url,
      invoiceId: invoice.id
    })
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || 'Error creating invoice'
    })
  }
})

// Webhook de QvaPay (recibe confirmación cuando pagan)
app.post('/api/webhook/qvapay', async (req, res) => {
  try {
    const webhookData = req.body
    console.log('Webhook recibido:', webhookData)
    
    const invoiceId = webhookData.invoice_id || webhookData.id
    
    if (invoiceId) {
      // Buscar la orden por invoiceId
      for (const [orderId, order] of orders.entries()) {
        if (order.qvapayInvoiceId === invoiceId) {
          order.status = 'paid'
          order.paidAt = new Date().toISOString()
          orders.set(orderId, order)
          console.log(`✅ Orden ${orderId} pagada`)
          break
        }
      }
    }
    
    res.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Verificar estado de una orden
app.get('/api/payment/status/:orderId', async (req, res) => {
  const order = orders.get(req.params.orderId)
  
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' })
  }
  
  res.json({
    success: true,
    status: order.status,
    paidAt: order.paidAt
  })
})

// Ruta de prueba para verificar que el backend funciona
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
})