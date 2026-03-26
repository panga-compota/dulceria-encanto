<template>
  <main class="py-12 md:py-16">
    <div class="container">
      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Columna izquierda: Formulario de envío -->
        <div>
          <h2 class="text-2xl font-serif font-semibold mb-6">Información de envío</h2>
          
          <form @submit.prevent="createOrder" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  required
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input 
                  v-model="form.phone" 
                  type="tel" 
                  required
                  placeholder="+53 5XXXXXXXX"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dirección de envío *
              </label>
              <input 
                v-model="form.address" 
                type="text" 
                required
                placeholder="Calle, número, municipio, provincia"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Municipio *
                </label>
                <input 
                  v-model="form.municipality" 
                  type="text" 
                  required
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <select 
                  v-model="form.province" 
                  required
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Selecciona una provincia</option>
                  <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico *
              </label>
              <input 
                v-model="form.email" 
                type="email" 
                required
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales (opcional)
              </label>
              <textarea 
                v-model="form.notes" 
                rows="3"
                placeholder="Instrucciones de entrega, horario preferido, etc."
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              :disabled="isCreatingOrder"
              class="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {{ isCreatingOrder ? 'Procesando...' : 'Continuar con el pago' }}
            </button>
          </form>
        </div>

        <!-- Columna derecha: Resumen del pedido -->
        <div>
          <div class="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h2 class="text-xl font-serif font-semibold mb-4">Tu pedido</h2>
            
            <div class="space-y-3 mb-4 max-h-96 overflow-y-auto">
              <div v-for="item in cartItems" :key="item.id" class="flex gap-3 pb-3 border-b border-gray-200">
                <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-lg object-cover" />
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                  <p class="text-primary font-semibold">${{ formatPrice(itemPrice(item) * item.quantity) }}</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-2 pt-4 border-t border-gray-200">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Envío</span>
                <span class="font-medium">{{ cartStore.shipping === 0 ? 'Gratis' : `$${formatPrice(cartStore.shipping)}` }}</span>
              </div>
              <div class="flex justify-between text-lg font-semibold pt-2">
                <span>Total</span>
                <span class="text-primary">${{ formatPrice(cartStore.total) }} USD</span>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                * El pago se procesará en USD. Para Transfermóvil se convertirá a CUP al tipo de cambio actual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de selección de método de pago -->
    <Transition name="modal">
      <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePaymentModal"></div>
        <div class="relative bg-white rounded-2xl max-w-md w-full p-6">
          <button @click="closePaymentModal" class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 class="text-xl font-serif font-semibold mb-4">Selecciona método de pago</h3>
          <p class="text-gray-600 mb-6">Total a pagar: <span class="font-bold text-primary">${{ formatPrice(cartStore.total) }} USD</span></p>
          
          <div class="space-y-3">
            <!-- Transfermóvil -->
            <div 
              class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary"
              :class="selectedPaymentMethod === 'transfermovil' ? 'border-primary bg-primary/5' : 'border-gray-200'"
              @click="selectedPaymentMethod = 'transfermovil'"
            >
              <div class="flex items-center gap-3">
                <img src="/images/transfermovil-logo.png" class="w-10 h-10" alt="Transfermóvil" />
                <div>
                  <h4 class="font-medium">Transfermóvil / EnZona</h4>
                  <p class="text-sm text-gray-500">Paga con código QR desde tu móvil</p>
                </div>
                <div class="ml-auto">
                  <div class="w-5 h-5 rounded-full border-2" :class="selectedPaymentMethod === 'transfermovil' ? 'border-primary bg-primary' : 'border-gray-300'"></div>
                </div>
              </div>
            </div>
            
            <!-- CubaPay -->
            <div 
              class="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary"
              :class="selectedPaymentMethod === 'cubapay' ? 'border-primary bg-primary/5' : 'border-gray-200'"
              @click="selectedPaymentMethod = 'cubapay'"
            >
              <div class="flex items-center gap-3">
                <img src="/images/cubapay-logo.png" class="w-10 h-10" alt="CubaPay" />
                <div>
                  <h4 class="font-medium">CubaPay</h4>
                  <p class="text-sm text-gray-500">Paga con tarjeta virtual o transferencia</p>
                </div>
                <div class="ml-auto">
                  <div class="w-5 h-5 rounded-full border-2" :class="selectedPaymentMethod === 'cubapay' ? 'border-primary bg-primary' : 'border-gray-300'"></div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            @click="processPayment"
            :disabled="isProcessing"
            class="w-full mt-6 bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {{ isProcessing ? 'Procesando...' : `Pagar ${formatPrice(cartStore.total)} USD` }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Modal de pago con Transfermóvil -->
    <Transition name="modal">
      <div v-if="showTransfermovilQR" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeTransfermovilModal"></div>
        <div class="relative bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <button @click="closeTransfermovilModal" class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="mb-4">
            <img src="/images/transfermovil-logo.png" class="w-16 h-16 mx-auto" alt="Transfermóvil" />
          </div>
          
          <h3 class="text-xl font-serif font-semibold mb-2">Pago con Transfermóvil</h3>
          <p class="text-gray-600 mb-4">Escanea este código QR desde la app Transfermóvil o EnZona</p>
          
          <div class="bg-white p-4 rounded-xl inline-block mx-auto mb-4">
            <img :src="transfermovilQR" class="w-64 h-64" alt="QR Code" />
          </div>
          
          <p class="text-sm text-gray-500 mb-2">
            Monto: <span class="font-bold text-primary">${{ formatPrice(cartStore.total) }} USD</span>
          </p>
          <p class="text-xs text-gray-400 mb-4">
            Código de pago: <span class="font-mono">{{ paymentCode }}</span>
          </p>
          
          <div class="bg-blue-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800">
              ⏳ Esperando confirmación de pago...
            </p>
            <p class="text-xs text-blue-600 mt-1">
              La página se actualizará automáticamente cuando se confirme el pago
            </p>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="checkPaymentStatus"
              class="flex-1 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-all"
            >
              Verificar estado
            </button>
            <button 
              @click="closeTransfermovilModal"
              class="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
          
          <p class="text-xs text-gray-400 mt-4">
            El código QR expira en {{ countdown }} segundos
          </p>
        </div>
      </div>
    </Transition>

    <!-- Loading overlay para CubaPay -->
    <div v-if="isRedirecting" class="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Redirigiendo a CubaPay...</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const cartStore = useCartStore()
const { showToast } = useToast()

// Estados
const form = ref({
  name: '',
  phone: '',
  address: '',
  municipality: '',
  province: '',
  email: '',
  notes: ''
})

const isCreatingOrder = ref(false)
const showPaymentModal = ref(false)
const selectedPaymentMethod = ref('')
const isProcessing = ref(false)
const showTransfermovilQR = ref(false)
const transfermovilQR = ref('')
const paymentCode = ref('')
const orderId = ref('')
let statusInterval = null
const countdown = ref(900)
let countdownInterval = null
const isRedirecting = ref(false)

// Provincias de Cuba
const provinces = [
  'Pinar del Río', 'Artemisa', 'La Habana', 'Mayabeque', 'Matanzas',
  'Cienfuegos', 'Villa Clara', 'Sancti Spíritus', 'Ciego de Ávila',
  'Camagüey', 'Las Tunas', 'Granma', 'Holguín', 'Santiago de Cuba',
  'Guantánamo', 'Isla de la Juventud'
]

const cartItems = computed(() => cartStore.items)

const formatPrice = (price) => {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const itemPrice = (item) => {
  return item.discount ? item.price * (1 - item.discount / 100) : item.price
}

// Crear orden
const createOrder = async () => {
  isCreatingOrder.value = true
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.value.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: itemPrice(item)
        })),
        total: cartStore.total,
        shippingAddress: {
          name: form.value.name,
          address: form.value.address,
          municipality: form.value.municipality,
          province: form.value.province,
          phone: form.value.phone,
          notes: form.value.notes
        },
        customer: {
          name: form.value.name,
          email: form.value.email,
          phone: form.value.phone
        }
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      orderId.value = data.orderId
      showPaymentModal.value = true
    } else {
      showToast('Error al crear la orden', 'error')
    }
  } catch (error) {
    console.error('Error creating order:', error)
    showToast('Error de conexión', 'error')
  } finally {
    isCreatingOrder.value = false
  }
}

// Procesar pago
const processPayment = async () => {
  if (!selectedPaymentMethod.value) {
    showToast('Selecciona un método de pago', 'error')
    return
  }
  
  isProcessing.value = true
  showPaymentModal.value = false
  
  if (selectedPaymentMethod.value === 'transfermovil') {
    await processTransfermovilPayment()
  } else if (selectedPaymentMethod.value === 'cubapay') {
    await processCubaPayPayment()
  }
  
  isProcessing.value = false
}

// Procesar pago con Transfermóvil
const processTransfermovilPayment = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/transfermovil/generate-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderId.value,
        amount: cartStore.total,
        customerPhone: form.value.phone
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      transfermovilQR.value = data.qrUrl
      paymentCode.value = data.paymentCode
      countdown.value = data.expiresIn
      showTransfermovilQR.value = true
      
      // Iniciar verificación de estado
      startStatusCheck()
      startCountdown()
    } else {
      showToast('Error al generar el QR', 'error')
    }
  } catch (error) {
    console.error('Error generating Transfermóvil QR:', error)
    showToast('Error de conexión', 'error')
  }
}

// Procesar pago con CubaPay
const processCubaPayPayment = async () => {
  try {
    isRedirecting.value = true
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/qvapay/create-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderId.value,
        amount: cartStore.total,
        customerEmail: form.value.email
      })
    })
    
    const data = await response.json()
    
    if (data.success && data.paymentUrl) {
      // Redirigir a CubaPay
      window.location.href = data.paymentUrl
    } else {
      isRedirecting.value = false
      showToast('Error al iniciar pago con CubaPay', 'error')
    }
  } catch (error) {
    console.error('Error processing CubaPay:', error)
    isRedirecting.value = false
    showToast('Error de conexión', 'error')
  }
}

// Verificar estado del pago
const checkPaymentStatus = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/status/${orderId.value}`)
    const data = await response.json()
    
    if (data.success && data.status === 'paid') {
      stopStatusCheck()
      stopCountdown()
      showTransfermovilQR.value = false
      
      showToast('¡Pago confirmado! Redirigiendo...', 'success')
      
      // Vaciar carrito y redirigir
      cartStore.clearCart()
      setTimeout(() => {
        router.push(`/checkout/success?order=${orderId.value}`)
      }, 1500)
    } else if (data.status === 'expired') {
      stopStatusCheck()
      stopCountdown()
      showTransfermovilQR.value = false
      showToast('El código QR ha expirado. Por favor, intenta de nuevo.', 'error')
    }
  } catch (error) {
    console.error('Error checking payment status:', error)
  }
}

// Iniciar verificación automática
const startStatusCheck = () => {
  statusInterval = setInterval(checkPaymentStatus, 5000) // Cada 5 segundos
}

const stopStatusCheck = () => {
  if (statusInterval) {
    clearInterval(statusInterval)
    statusInterval = null
  }
}

// Contador para expiración del QR
const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      stopCountdown()
      showTransfermovilQR.value = false
      showToast('El código QR ha expirado', 'error')
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Cerrar modales
const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedPaymentMethod.value = ''
}

const closeTransfermovilModal = () => {
  showTransfermovilQR.value = false
  stopStatusCheck()
  stopCountdown()
}

// Limpiar intervalos al desmontar
onUnmounted(() => {
  stopStatusCheck()
  stopCountdown()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>