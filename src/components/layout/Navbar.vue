<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <nav class="container flex items-center justify-between h-20">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark"></div>
        <span class="font-serif text-xl font-semibold tracking-tight text-gray-800">
          Dulce<span class="text-primary">Encanto</span>
        </span>
      </a>

      <!-- Menú Desktop -->
      <div class="hidden md:flex items-center gap-8">
        <a 
          v-for="item in menuItems" 
          :key="item.path"
          :href="item.path"
          class="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
          :class="{ 'text-primary': isActive(item.path) }"
        >
          {{ item.name }}
        </a>
      </div>

      <!-- Acciones -->
      <div class="flex items-center gap-4">
        <button class="relative p-2 text-gray-600 hover:text-primary transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <button 
          @click="cartStore.toggleCart"
          class="relative p-2 text-gray-600 hover:text-primary transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span 
            v-if="cartStore.totalItems > 0"
            class="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center px-1"
          >
            {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
          </span>
        </button>

        <!-- Botón menú móvil -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
              d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Menú Móvil -->
    <div 
      v-show="mobileMenuOpen"
      class="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-lg"
    >
      <div class="container py-4 flex flex-col gap-3">
        <a 
          v-for="item in menuItems" 
          :key="item.path"
          :href="item.path"
          class="py-2 text-gray-600 hover:text-primary transition-colors"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
  </header>

  <!-- Spacer -->
  <div class="h-20"></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cartStore = useCartStore()
const mobileMenuOpen = ref(false)

const menuItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/productos' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>