<template>
  <section class="py-20">
    <div class="container">
      <div class="grid md:grid-cols-4 gap-8">
        <div v-for="benefit in benefits" :key="benefit.title" class="text-center group">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
            <component :is="benefit.icon" class="w-8 h-8 text-primary" />
          </div>
          <h3 class="font-serif font-semibold text-gray-900 mb-2">{{ benefit.title }}</h3>
          <p class="text-sm text-gray-500">{{ benefit.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  {
    title: 'Ingredientes naturales',
    description: 'Solo usamos ingredientes frescos y de la más alta calidad',
    icon: 'LeafIcon'
  },
  {
    title: 'Envío gratis',
    description: 'En compras mayores a $500 en la CDMX',
    icon: 'TruckIcon'
  },
  {
    title: 'Elaboración artesanal',
    description: 'Cada producto es hecho a mano con dedicación',
    icon: 'HeartIcon'
  },
  {
    title: 'Atención personalizada',
    description: 'Te ayudamos a crear el postre perfecto para tu evento',
    icon: 'ChatIcon'
  }
]
</script>

<script>
// Iconos simples (puedes usar los que prefieras)
const LeafIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>' }
const TruckIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2zM5 13V7a2 2 0 012-2h8a2 2 0 012 2v6" /></svg>' }
const HeartIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>' }
const ChatIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>' }

export default {
  components: { LeafIcon, TruckIcon, HeartIcon, ChatIcon }
}
</script>