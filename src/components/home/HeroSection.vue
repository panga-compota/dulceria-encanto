<template>
  <section class="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary/30">
    <!-- Fondo decorativo sutil -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
      ></div>
      <div 
        class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
      ></div>
    </div>

    <!-- Contenido principal -->
    <div class="container relative z-10 py-20 md:py-32">
      <div class="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 mb-6 shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span class="text-xs font-medium text-gray-600 tracking-wide uppercase">
            Artesanía desde 1995
          </span>
        </div>

        <!-- Título principal -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold tracking-tight text-gray-900 mb-6">
          Dulces momentos
          <span class="text-primary block mt-2 md:mt-3">
            hechos con amor
          </span>
        </h1>

        <!-- Descripción -->
        <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
          Descubre nuestra colección de postres artesanales, elaborados con ingredientes 
          de la más alta calidad. Cada bocado es una experiencia única.
        </p>

        <!-- Botones CTA -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button 
            @click="exploreProducts"
            class="group relative px-8 py-4 bg-primary text-white rounded-full font-medium overflow-hidden transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5"
          >
            <span class="relative z-10 flex items-center gap-2">
              Explorar productos
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          
          <button 
            @click="viewCatalog"
            class="px-8 py-4 bg-white text-gray-700 rounded-full font-medium border border-gray-200 hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
          >
            Ver catálogo
          </button>
        </div>

        <!-- Stats / características -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-16 pt-8 border-t border-gray-200/50 max-w-2xl mx-auto md:mx-0">
          <div class="text-center md:text-left">
            <div class="text-2xl font-serif font-semibold text-primary">+50</div>
            <div class="text-sm text-gray-500 mt-1">Variedades</div>
          </div>
          <div class="text-center md:text-left">
            <div class="text-2xl font-serif font-semibold text-primary">100%</div>
            <div class="text-sm text-gray-500 mt-1">Ingredientes naturales</div>
          </div>
          <div class="text-center md:text-left">
            <div class="text-2xl font-serif font-semibold text-primary">24h</div>
            <div class="text-sm text-gray-500 mt-1">Frescura garantizada</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Elemento decorativo flotante (opcional) -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block animate-bounce">
      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const exploreProducts = () => {
  router.push('/productos')
}

const viewCatalog = () => {
  // Puedes hacer scroll a la sección de productos destacados
  const element = document.getElementById('featured-products')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>