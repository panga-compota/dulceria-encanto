import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Estado
  const items = ref([])
  const isOpen = ref(false)

  // Getters computados
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      const price = item.discount 
        ? item.price * (1 - item.discount / 100)
        : item.price
      return total + (price * item.quantity)
    }, 0)
  })

  const shipping = computed(() => {
    return subtotal.value > 500 ? 0 : 50
  })

  const total = computed(() => {
    return subtotal.value + shipping.value
  })

  const itemCount = computed(() => {
    return items.value.length
  })

  // Acciones
  const addItem = (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount || null,
        image: product.image,
        category: product.category,
        quantity: product.quantity || 1,
        maxQuantity: 10 // límite máximo
      })
    }

    // Mostrar notificación (la implementaremos después)
    showNotification(`${product.name} añadido al carrito`)
  }

  const removeItem = (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      const removedItem = items.value[index]
      items.value.splice(index, 1)
      showNotification(`${removedItem.name} eliminado del carrito`)
    }
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else if (quantity <= item.maxQuantity) {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
    showNotification('Carrito vaciado')
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const openCart = () => {
    isOpen.value = true
  }

  const closeCart = () => {
    isOpen.value = false
  }

  // Helper para notificaciones (temporal)
  const showNotification = (message) => {
    // Disparamos un evento personalizado que el componente Notification escuchará
    window.dispatchEvent(new CustomEvent('cart-notification', { detail: { message } }))
  }

  return {
    // Estado
    items,
    isOpen,
    // Getters
    totalItems,
    subtotal,
    shipping,
    total,
    itemCount,
    // Acciones
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
  }
})