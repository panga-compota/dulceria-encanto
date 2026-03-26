<template>
  <main class="min-h-screen flex items-center justify-center py-20">
    <div class="container max-w-md text-center">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- Icono de éxito -->
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-serif font-semibold text-gray-900 mb-2">
          ¡Pago exitoso!
        </h1>
        <p class="text-gray-600 mb-6">
          Tu pedido ha sido confirmado. Pronto recibirás un correo con los detalles.
        </p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-500">Número de pedido</p>
          <p class="text-lg font-mono font-semibold text-primary">{{ orderId }}</p>
        </div>
        
        <button 
          @click="goToHome"
          class="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-all"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const orderId = ref('')

onMounted(() => {
  orderId.value = route.query.order || 'No disponible'
})

const goToHome = () => {
  router.push('/')
}
</script>