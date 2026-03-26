<template>
  <main>
    <!-- Hero Section -->
    <HeroSection />
    
    <!-- Beneficios / Por qué elegirnos -->
    <BenefitsSection />
    
    <!-- Categorías destacadas -->
    <CategorySection />
    
    <!-- Productos destacados -->
    <section class="py-20">
      <div class="container">
        <ProductGrid
          :products="featuredProducts"
          title="Productos destacados"
          subtitle="Los favoritos de nuestros clientes"
          :columns="3"
          :show-view-all="true"
          @add-to-cart="handleAddToCart"
          @quick-view="handleQuickView"
          @view-all="goToProducts"
        />
      </div>
    </section>
    
    <!-- Banner promocional -->
    <PromoBanner />
    
    <!-- Testimonios -->
    <TestimonialsSection />
    
    <!-- Newsletter -->
    <NewsletterSection />
    
    <!-- Instagram Feed -->
    <InstagramFeed />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { getFeaturedProducts } from '@/data/products'
import HeroSection from '@/components/home/HeroSection.vue'
import BenefitsSection from '@/components/home/BenefitsSection.vue'
import CategorySection from '@/components/home/CategorySection.vue'
import PromoBanner from '@/components/home/PromoBanner.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import NewsletterSection from '@/components/home/NewsletterSection.vue'
import InstagramFeed from '@/components/home/InstagramFeed.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'

const router = useRouter()
const cartStore = useCartStore()
const featuredProducts = ref([])

onMounted(() => {
  featuredProducts.value = getFeaturedProducts()
})

const handleAddToCart = (product) => {
  cartStore.addItem(product)
}

const handleQuickView = (product) => {
  console.log('Vista rápida:', product.name)
}

const goToProducts = () => {
  router.push('/productos')
}
</script>