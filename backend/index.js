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
    console.log('📥 Recibida petición para crear factura:', req.body)
    
    const { orderId, amount, customerEmail, customerName } = req.body
    
    const order = orders.get(orderId)
    if (!order) {
      console.log('❌ Orden no encontrada:', orderId)
      return res.status(404).json({ success: false, error: 'Order not found' })
    }
    
    console.log('🔑 Usando App ID:', process.env.QVAPAY_APP_ID ? '✅ Configurado' : '❌ FALTA')
    console.log('🔐 Usando App Secret:', process.env.QVAPAY_APP_SECRET ? '✅ Configurado' : '❌ FALTA')
    
    const headers = {
      'app-id': process.env.QVAPAY_APP_ID,
      'app-secret': process.env.QVAPAY_APP_SECRET,
      'Content-Type': 'application/json'
    }
    
    const payload = {
      amount: amount,
      currency: 'USD',
      description: `Pedido ${orderId} - DulceEncanto`,
      customer_email: customerEmail,
      customer_name: customerName,
      redirect_url: `${process.env.FRONTEND_URL}/checkout/success?order=${orderId}`,
      webhook_url: `${process.env.BACKEND_URL}/api/webhook/qvapay`,
      expiration_minutes: 60
    }
    
    console.log('📤 Enviando a QvaPay:', JSON.stringify(payload, null, 2))
    
const response = await axios.post('https://api.qvapay.com/v2/invoice', payload, { headers })

console.log('📦 Respuesta completa de QvaPay:', JSON.stringify(response.data, null, 2))

// QvaPay puede devolver los datos en diferentes estructuras
const invoice = response.data.data || response.data
const invoiceId = invoice.id || invoice.invoice_id || invoice._id

console.log('✅ Factura creada ID:', invoiceId)
console.log('✅ URL de pago:', invoice.url || invoice.payment_url)

order.qvapayInvoiceId = invoiceId
order.qvapayInvoiceUrl = invoice.url || invoice.payment_url
orders.set(orderId, order)

res.json({
  success: true,
  invoiceUrl: invoice.url || invoice.payment_url,
  invoiceId: invoiceId
})    
  } catch (error) {
    console.error('❌ QvaPay error completo:')
    console.error('- Mensaje:', error.message)
    if (error.response) {
      console.error('- Status:', error.response.status)
      console.error('- Data:', JSON.stringify(error.response.data, null, 2))
    }
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
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