<template>
  <section class="py-20 bg-primary text-white">
    <div class="container text-center">
      <h2 class="text-3xl md:text-4xl font-serif font-semibold mb-4">
        ¿Quieres recibir ofertas exclusivas?
      </h2>
      <p class="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
        Suscríbete a nuestro newsletter y recibe un 10% de descuento en tu primera compra.
      </p>
      
      <form @submit.prevent="handleSubscribe" class="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
        <input
          v-model="email"
          type="email"
          required
          placeholder="Tu correo electrónico"
          class="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          :disabled="isSubscribing"
          class="px-8 py-3 bg-white text-primary rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {{ isSubscribing ? 'Enviando...' : 'Suscribirme' }}
        </button>
      </form>
      
      <p class="text-sm opacity-75 mt-4">
        No te preocupes, no enviaremos spam. Puedes darte de baja cuando quieras.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const email = ref('')
const isSubscribing = ref(false)

const handleSubscribe = async () => {
  isSubscribing.value = true
  
  try {
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Suscripción:', email.value)
    
    showToast('¡Gracias por suscribirte! Revisa tu correo para el descuento.', 'success')
    email.value = ''
  } catch (error) {
    showToast('Error al suscribirte. Intenta de nuevo.', 'error')
  } finally {
    isSubscribing.value = false
  }
}
</script>