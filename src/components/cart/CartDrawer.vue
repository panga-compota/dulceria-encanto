<template>
  <Teleport to="body">
    <Transition name="cart">
      <div
        v-if="cartStore.isOpen"
        class="fixed inset-0 z-50"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="cartStore.closeCart"
        ></div>

        <!-- Drawer -->
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 class="text-xl font-serif font-semibold text-gray-900">
                Mi Carrito
              </h2>
            </div>
            <button
              @click="cartStore.closeCart"
              class="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Contenido -->
          <div class="flex-1 overflow-y-auto p-5">
            <div v-if="cartStore.items.length === 0" class="h-full flex flex-col items-center justify-center text-center">
              <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-lg font-serif font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p class="text-gray-500 text-sm mb-6">¡Explora nuestros productos y encuentra tus dulces favoritos!</p>
              <button
                @click="cartStore.closeCart"
                class="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all"
              >
                Explorar productos
              </button>
            </div>

            <!-- Lista de productos -->
            <div v-else class="space-y-4">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-4 py-4 border-b border-gray-100"
              >
                <!-- Imagen -->
                <div class="w-20 h-20 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                </div>

                <!-- Info -->
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="font-serif font-medium text-gray-900">{{ item.name }}</h3>
                    <button
                      @click="cartStore.removeItem(item.id)"
                      class="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mb-2">{{ item.category }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-primary font-semibold">
                      ${{ formatPrice(itemPrice(item)) }}
                    </span>
                    <div class="flex items-center gap-2 border border-gray-200 rounded-lg">
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                        class="px-2 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="w-8 text-center text-sm">{{ item.quantity }}</span>
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                        class="px-2 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con totales -->
          <div v-if="cartStore.items.length > 0" class="border-t border-gray-100 p-5 space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío</span>
                <span class="font-medium">
                  {{ cartStore.shipping === 0 ? 'Gratis' : `$${formatPrice(cartStore.shipping)}` }}
                </span>
              </div>
              <div class="flex justify-between text-lg font-semibold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span class="text-primary">${{ formatPrice(cartStore.total) }}</span>
              </div>
              <p v-if="cartStore.subtotal < 500" class="text-xs text-gray-500 mt-2">
                🎁 Faltan ${{ formatPrice(500 - cartStore.subtotal) }} para envío gratis
              </p>
              <p v-else class="text-xs text-green-600 mt-2">
                ✨ Envío gratis incluido
              </p>
            </div>

            <button
              @click="checkout"
              class="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg"
            >
              Finalizar compra
            </button>

            <button
              @click="cartStore.clearCart"
              class="w-full text-gray-500 text-sm hover:text-red-500 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const formatPrice = (price) => {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const itemPrice = (item) => {
  const price = item.discount 
    ? item.price * (1 - item.discount / 100)
    : item.price
  return price
}

const checkout = () => {
  cartStore.closeCart()
  router.push('/checkout')
}
</script>

<style scoped>
.cart-enter-active,
.cart-leave-active {
  transition: opacity 0.3s ease;
}

.cart-enter-from,
.cart-leave-to {
  opacity: 0;
}

.cart-enter-active .absolute.right-0,
.cart-leave-active .absolute.right-0 {
  transition: transform 0.3s ease;
}

.cart-enter-from .absolute.right-0,
.cart-leave-to .absolute.right-0 {
  transform: translateX(100%);
}
</style>