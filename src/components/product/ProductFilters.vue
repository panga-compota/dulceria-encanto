<template>
  <div class="space-y-6">
    <!-- Búsqueda -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Buscar productos
      </label>
      <div class="relative">
        <input
          :value="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por nombre, descripción..."
          class="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Categorías -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Categorías
      </label>
      <div class="space-y-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="handleCategoryChange(cat)"
          class="w-full text-left px-3 py-2 rounded-lg transition-all capitalize"
          :class="selectedCategory === cat 
            ? 'bg-primary text-white' 
            : 'text-gray-600 hover:bg-gray-100'"
        >
          {{ cat === 'todos' ? 'Todos los productos' : cat }}
        </button>
      </div>
    </div>

    <!-- Ordenar -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Ordenar por
      </label>
      <select
        :value="sortBy"
        @change="handleSortChange"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      >
        <option value="default">Destacados</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
        <option value="name-asc">Nombre: A - Z</option>
        <option value="name-desc">Nombre: Z - A</option>
      </select>
    </div>

    <!-- Botón reset -->
    <button
      @click="handleReset"
      class="w-full py-3 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
    >
      Limpiar filtros
    </button>
  </div>
</template>

<script setup>
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

const productsStore = useProductsStore()
const { selectedCategory, searchQuery, sortBy, categories } = storeToRefs(productsStore)

const handleSearch = (e) => {
  productsStore.setSearchQuery(e.target.value)
}

const handleCategoryChange = (category) => {
  productsStore.setCategory(category)
}

const handleSortChange = (e) => {
  productsStore.setSortBy(e.target.value)
}

const handleReset = () => {
  productsStore.resetFilters()
}
</script>