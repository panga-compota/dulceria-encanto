<template>
  <section class="py-20">
    <div class="container">
      <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white">
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
        
        <div class="relative p-8 md:p-12 text-center">
          <span class="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            🎁 Oferta especial
          </span>
          <h3 class="text-3xl md:text-5xl font-serif font-semibold mb-4">
            20% de descuento
          </h3>
          <p class="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            En compras mayores a $500. Aprovecha esta promoción por tiempo limitado.
          </p>
          <button
            @click="goToProducts"
            class="px-8 py-3 bg-white text-primary rounded-full font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Comprar ahora
          </button>
          <p class="text-sm opacity-75 mt-4">
            *Válido hasta el 31 de diciembre de 2024
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToProducts = () => {
  router.push('/productos')
}
</script>