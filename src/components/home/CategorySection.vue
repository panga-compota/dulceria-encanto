<template>
  <section class="py-20">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
          Explora por categorías
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Encuentra el postre perfecto para cada ocasión
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="category in categories"
          :key="category.name"
          @click="goToCategory(category.slug)"
          class="group cursor-pointer"
        >
          <div class="relative rounded-2xl overflow-hidden aspect-square mb-4">
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white text-xl font-serif font-semibold">{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  {
    name: 'Pasteles',
    slug: 'pasteles',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'
  },
  {
    name: 'Cupcakes',
    slug: 'cupcakes',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop'
  },
  {
    name: 'Galletas',
    slug: 'galletas',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop'
  },
  {
    name: 'Postres',
    slug: 'postres',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop'
  }
]

const goToCategory = (slug) => {
  router.push({ path: '/productos', query: { category: slug } })
}
</script>