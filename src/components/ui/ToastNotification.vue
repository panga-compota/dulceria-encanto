<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[380px] animate-slide-in"
        :class="{
          'bg-gray-900 text-white': notification.type === 'success',
          'bg-red-500 text-white': notification.type === 'error',
          'bg-blue-500 text-white': notification.type === 'info'
        }"
      >
        <div class="flex-shrink-0">
          <svg v-if="notification.type === 'success'" class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="notification.type === 'error'" class="w-5 h-5 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="flex-1 text-sm font-medium">{{ notification.message }}</p>
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 opacity-70 hover:opacity-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const notifications = ref([])
let nextId = 0

const addNotification = (message, type = 'success') => {
  const id = nextId++
  notifications.value.push({ id, message, type })
  
  setTimeout(() => {
    removeNotification(id)
  }, 3000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

const handleCartNotification = (event) => {
  addNotification(event.detail.message, 'success')
}

const handleToastNotification = (event) => {
  addNotification(event.detail.message, event.detail.type || 'success')
}

onMounted(() => {
  window.addEventListener('cart-notification', handleCartNotification)
  window.addEventListener('toast-notification', handleToastNotification)
})

onUnmounted(() => {
  window.removeEventListener('cart-notification', handleCartNotification)
  window.removeEventListener('toast-notification', handleToastNotification)
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease forwards;
}
</style>