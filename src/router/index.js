import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/productos',
      name: 'products',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/nosotros',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/contacto',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue')
    },
    {
      path: '/checkout/success',
      name: 'checkout-success',
      component: () => import('../views/CheckoutSuccessView.vue')
    },
    {
      path: '/checkout/cancel',
      name: 'checkout-cancel',
      component: () => import('../views/CheckoutCancelView.vue')
    }
  ]
})

export default router