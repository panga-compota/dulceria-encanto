<template>
  <div class="space-y-8">
    <!-- Encabezado con filtros (opcional) -->
    <div v-if="showHeader" class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-2">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-gray-500">
          {{ subtitle }}
        </p>
      </div>
      
      <button 
        v-if="showViewAll"
        @click="viewAll"
        class="group flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
      >
        Ver todos
        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Grid de productos -->
    <div 
      class="grid gap-6"
      :class="{
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': columns === 3,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': columns === 4,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2': columns === 2
      }"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
        @quick-view="handleQuickView"
      />
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="!loading && products.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p class="text-gray-500">No hay productos disponibles</p>
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: 'Productos destacados'
  },
  subtitle: {
    type: String,
    default: ''
  },
  columns: {
    type: Number,
    default: 3,
    validator: (value) => [2, 3, 4].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showViewAll: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-cart', 'quick-view', 'view-all'])

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

const handleQuickView = (product) => {
  emit('quick-view', product)
}

const viewAll = () => {
  emit('view-all')
}
</script>