<template>
  <main class="py-12 md:py-16">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-4">
          Nuestros productos
        </h1>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Descubre nuestra selección de postres artesanales, elaborados con amor 
          y los mejores ingredientes.
        </p>
      </div>

      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar con filtros (Desktop) -->
        <aside class="hidden lg:block">
          <div class="sticky top-24">
            <ProductFilters />
          </div>
        </aside>

        <!-- Contenido principal -->
        <div class="lg:col-span-3">
          <!-- Filtros móviles y contador -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <!-- Contador de productos -->
            <p class="text-sm text-gray-500">
              Mostrando <span class="font-semibold text-gray-900">{{ productsCount }}</span> productos
            </p>

            <!-- Botón filtros móvil -->
            <button
              @click="mobileFiltersOpen = true"
              class="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-primary transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filtros</span>
            </button>

            <!-- Selector ordenamiento móvil -->
            <select
              :value="sortBy"
              @change="handleSortChange"
              class="lg:hidden w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="default">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A - Z</option>
              <option value="name-desc">Nombre: Z - A</option>
            </select>
          </div>

          <!-- Grid de productos -->
          <div v-if="!loading && paginatedProducts.length > 0">
            <ProductGrid
              :products="paginatedProducts"
              :columns="3"
              :show-header="false"
              @add-to-cart="handleAddToCart"
              @quick-view="handleQuickView"
            />
          </div>

          <!-- Estado vacío -->
          <div v-else-if="!loading && paginatedProducts.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-serif font-medium text-gray-900 mb-2">
              No encontramos productos
            </h3>
            <p class="text-gray-500 mb-6">
              Intenta con otros filtros o busca otra categoría.
            </p>
            <button
              @click="resetFilters"
              class="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all"
            >
              Limpiar filtros
            </button>
          </div>

          <!-- Paginación -->
          <div class="mt-12">
            <ProductPagination />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de filtros móvil -->
    <Transition name="modal">
      <div
        v-if="mobileFiltersOpen"
        class="fixed inset-0 z-50 lg:hidden"
      >
        <div class="absolute inset-0 bg-black/50" @click="mobileFiltersOpen = false"></div>
        <div class="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl p-6 overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-serif font-semibold">Filtros</h3>
            <button @click="mobileFiltersOpen = false" class="p-2 hover:bg-gray-100 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ProductFilters />
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'
import ProductGrid from '@/components/product/ProductGrid.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import ProductPagination from '@/components/product/ProductPagination.vue'

const cartStore = useCartStore()
const productsStore = useProductsStore()
const { paginatedProducts, productsCount, sortBy } = storeToRefs(productsStore)

const loading = ref(false)
const mobileFiltersOpen = ref(false)

onMounted(() => {
  loading.value = true
  productsStore.loadProducts()
  setTimeout(() => {
    loading.value = false
  }, 500)
})

const handleAddToCart = (product) => {
  cartStore.addItem(product)
}

const handleQuickView = (product) => {
  // El modal ya se maneja dentro de ProductCard
  console.log('Vista rápida:', product.name)
}

const handleSortChange = (e) => {
  productsStore.setSortBy(e.target.value)
}

const resetFilters = () => {
  productsStore.resetFilters()
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

.modal-enter-active .absolute.right-0,
.modal-leave-active .absolute.right-0 {
  transition: transform 0.3s ease;
}

.modal-enter-from .absolute.right-0,
.modal-leave-to .absolute.right-0 {
  transform: translateX(100%);
}
</style>