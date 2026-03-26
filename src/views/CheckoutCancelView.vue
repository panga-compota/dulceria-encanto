<template>
  <main class="min-h-screen flex items-center justify-center py-20">
    <div class="container max-w-md text-center">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- Icono de cancelación -->
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-serif font-semibold text-gray-900 mb-2">
          Pago cancelado
        </h1>
        <p class="text-gray-600 mb-6">
          No te preocupes, puedes intentar nuevamente cuando quieras.
        </p>
        
        <div class="flex flex-col gap-3">
          <button 
            @click="goToCheckout"
            class="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-all"
          >
            Reintentar pago
          </button>
          
          <button 
            @click="goToHome"
            class="w-full border border-gray-200 text-gray-600 py-3 rounded-full font-semibold hover:border-primary hover:text-primary transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCheckout = () => {
  router.push('/checkout')
}

const goToHome = () => {
  router.push('/')
}
</script>