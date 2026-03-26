<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      >
        <!-- Overlay con blur -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeModal"
        ></div>

        <!-- Contenido del modal -->
        <div
          class="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          @click.stop
        >
          <!-- Botón cerrar -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="flex flex-col md:flex-row">
            <!-- Columna izquierda: Imagen -->
            <div class="md:w-1/2 bg-secondary/20 p-6 md:p-8">
              <div class="sticky top-0">
                <div class="relative rounded-xl overflow-hidden bg-white">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-auto object-cover"
                  />
                  
                  <!-- Badge de descuento -->
                  <div
                    v-if="product.discount"
                    class="absolute top-4 left-4 bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full"
                  >
                    -{{ product.discount }}%
                  </div>
                </div>

                <!-- Miniaturas (opcional para galería) -->
                <div class="grid grid-cols-4 gap-2 mt-4">
                  <div
                    v-for="(thumb, index) in product.thumbnails || [product.image]"
                    :key="index"
                    class="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                    :class="currentImage === thumb ? 'border-primary' : 'border-transparent hover:border-gray-300'"
                    @click="currentImage = thumb"
                  >
                    <img :src="thumb" :alt="`Vista ${index + 1}`" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna derecha: Información -->
            <div class="md:w-1/2 p-6 md:p-8">
              <!-- Categoría -->
              <p class="text-sm text-primary uppercase tracking-wider font-medium mb-2">
                {{ product.category }}
              </p>

              <!-- Nombre -->
              <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
                {{ product.name }}
              </h2>

              <!-- Rating (ejemplo estático) -->
              <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center gap-1">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= 4 ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-sm text-gray-500">(24 reseñas)</span>
              </div>

              <!-- Precio -->
              <div class="flex items-center gap-3 mb-6">
                <span class="text-4xl font-serif font-bold text-primary">
                  ${{ formatPrice(finalPrice) }}
                </span>
                <span
                  v-if="product.oldPrice"
                  class="text-lg text-gray-400 line-through"
                >
                  ${{ formatPrice(product.oldPrice) }}
                </span>
              </div>

              <!-- Descripción -->
              <p class="text-gray-600 leading-relaxed mb-6">
                {{ product.description }}
              </p>

              <!-- Características adicionales -->
              <div class="border-t border-b border-gray-100 py-4 mb-6">
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span class="text-sm text-gray-600">Peso: 500g</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm text-gray-600">Fresco por 24h</span>
                  </div>
                </div>
              </div>

              <!-- Selector de cantidad y botón de compra -->
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <span class="text-gray-700 font-medium">Cantidad:</span>
                  <div class="flex items-center border border-gray-200 rounded-lg">
                    <button
                      @click="decrementQuantity"
                      class="px-3 py-2 hover:bg-gray-50 transition-colors"
                      :disabled="quantity <= 1"
                    >
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-12 text-center font-medium">{{ quantity }}</span>
                    <button
                      @click="incrementQuantity"
                      class="px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  @click="handleAddToCart"
                  class="w-full bg-primary text-white py-4 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Añadir al carrito - ${{ formatPrice(finalPrice * quantity) }}
                </button>

                <button
                  @click="handleBuyNow"
                  class="w-full bg-white text-gray-700 py-4 rounded-full font-medium border border-gray-200 hover:border-primary hover:text-primary transition-all duration-300"
                >
                  Comprar ahora
                </button>
              </div>

              <!-- Información adicional -->
              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-start gap-2 text-sm text-gray-500">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Envío gratis en compras mayores a $500. Entrega en 24-48 horas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const quantity = ref(1)
const currentImage = ref('')

// Reiniciar cantidad cuando se abre el modal con un producto nuevo
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    quantity.value = 1
    currentImage.value = props.product.image
  }
})

watch(() => props.product, () => {
  currentImage.value = props.product.image
}, { immediate: true })

const finalPrice = computed(() => {
  if (props.product.discount) {
    return props.product.price * (1 - props.product.discount / 100)
  }
  return props.product.price
})

const formatPrice = (price) => {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const closeModal = () => {
  emit('close')
}

const handleAddToCart = () => {
  emit('add-to-cart', {
    ...props.product,
    quantity: quantity.value,
    subtotal: finalPrice.value * quantity.value
  })
  closeModal()
}

const handleBuyNow = () => {
  emit('add-to-cart', {
    ...props.product,
    quantity: quantity.value,
    subtotal: finalPrice.value * quantity.value
  })
  closeModal()
  // Redirigir al checkout
  // router.push('/checkout')
}
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
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>