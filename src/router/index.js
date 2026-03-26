import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/productos',
      name: 'products',
      component: () => import('../views/ProductsView.vue')
    }
  ]
})

export default router