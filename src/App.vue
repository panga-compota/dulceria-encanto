<template>
  <Navbar />
  <router-view />
  <Footer />
  <CartDrawer />
  <ToastNotification />
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
</script>