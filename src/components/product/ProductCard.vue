<template>
  <div 
    class="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
  >
    <!-- Badge de oferta (opcional) -->
    <div 
      v-if="product.discount"
      class="absolute top-4 left-4 z-10 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg"
    >
      -{{ product.discount }}%
    </div>

    <!-- Contenedor de imagen -->
    <div class="relative overflow-hidden bg-secondary/30 aspect-square">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Overlay con botón de vista rápida (aparece en hover) -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button 
          @click="openQuickView"
          class="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white"
        >
          Vista rápida
        </button>
      </div>
    </div>

    <!-- Información del producto -->
    <div class="p-5">
      <!-- Categoría -->
      <p class="text-xs text-primary uppercase tracking-wider mb-2 font-medium">
        {{ product.category }}
      </p>
      
      <!-- Nombre -->
      <h3 class="text-lg font-serif font-semibold text-gray-800 mb-2 line-clamp-1">
        {{ product.name }}
      </h3>
      
      <!-- Descripción corta -->
      <p class="text-gray-500 text-sm mb-4 line-clamp-2">
        {{ product.description }}
      </p>
      
      <!-- Precio y acciones -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl font-serif font-bold text-primary">
            ${{ formatPrice(finalPrice) }}
          </span>
          <span 
            v-if="product.oldPrice"
            class="text-sm text-gray-400 line-through"
          >
            ${{ formatPrice(product.oldPrice) }}
          </span>
        </div>
        
        <button 
          @click="addToCart"
          class="p-2 rounded-full bg-secondary/50 text-primary hover:bg-primary hover:text-white transition-all duration-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal de vista rápida -->
    <QuickViewModal
      :is-open="quickViewOpen"
      :product="product"
      @close="closeQuickView"
      @add-to-cart="handleAddToCartFromModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuickViewModal from './QuickViewModal.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.id && value.name && value.price && value.image
    }
  }
})

const emit = defineEmits(['add-to-cart', 'quick-view'])

const quickViewOpen = ref(false)

const finalPrice = computed(() => {
  if (props.product.discount) {
    return props.product.price * (1 - props.product.discount / 100)
  }
  return props.product.price
})

const formatPrice = (price) => {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const addToCart = () => {
  emit('add-to-cart', { ...props.product, quantity: 1 })
}

const openQuickView = () => {
  quickViewOpen.value = true
  emit('quick-view', props.product)
}

const closeQuickView = () => {
  quickViewOpen.value = false
}

const handleAddToCartFromModal = (productWithQuantity) => {
  emit('add-to-cart', productWithQuantity)
}
</script>