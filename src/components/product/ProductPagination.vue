<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
    <!-- Botón anterior -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="p-2 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Números de página -->
    <div class="flex gap-2">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        class="min-w-[40px] h-10 rounded-lg font-medium transition-all"
        :class="currentPage === page
          ? 'bg-primary text-white'
          : 'border border-gray-200 hover:border-primary hover:text-primary'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Botón siguiente -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="p-2 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

const productsStore = useProductsStore()
const { currentPage, totalPages } = storeToRefs(productsStore)

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

const goToPage = (page) => {
  if (page !== '...') {
    productsStore.setPage(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>