import express from 'express'
import cors from 'cors'
import axios from 'axios'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

// Configuración QvaPay
const QVAPAY_APP_ID = process.env.QVAPAY_APP_ID
const QVAPAY_APP_SECRET = process.env.QVAPAY_APP_SECRET
const QVAPAY_BASE_URL = 'https://api.qvapay.com'
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tu-sitio.netlify.app'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

// Almacenamiento en memoria (para empezar)
const orders = new Map()

// ============ ENDPOINTS ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Crear orden
app.post('/api/create-order', async (req, res) => {
  try {
    const { items, total, customer } = req.body
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    
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
    console.error('Error creating order:', error)
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
    
    const headers = {
      'app-id': QVAPAY_APP_ID,
      'app-secret': QVAPAY_APP_SECRET,
      'Content-Type': 'application/json'
    }
    
    const response = await axios.post(`${QVAPAY_BASE_URL}/v2/invoice`, {
      amount: amount,
      currency: 'USD',
      description: `Pedido ${orderId} - DulceEncanto`,
      customer_email: customerEmail,
      customer_name: customerName,
      redirect_url: `${FRONTEND_URL}/checkout/success?order=${orderId}`,
      webhook_url: `${BACKEND_URL}/api/webhook/qvapay`,
      expiration_minutes: 60
    }, { headers })
    
    const invoice = response.data
    order.qvapayInvoiceId = invoice.id
    order.qvapayInvoiceUrl = invoice.url
    orders.set(orderId, order)
    
    res.json({
      success: true,
      invoiceUrl: invoice.url,
      invoiceId: invoice.id
    })
    
  } catch (error) {
    console.error('QvaPay error:', error.response?.data || error.message)
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || 'Error creating invoice'
    })
  }
})

// Webhook de QvaPay
app.post('/api/webhook/qvapay', async (req, res) => {
  try {
    const webhookData = req.body
    console.log('Webhook recibido:', webhookData)
    
    const invoiceId = webhookData.invoice_id || webhookData.id
    
    if (invoiceId) {
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

// Verificar estado
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📦 Frontend URL: ${FRONTEND_URL}`)
  console.log(`🔗 Backend URL: ${BACKEND_URL}`)
})