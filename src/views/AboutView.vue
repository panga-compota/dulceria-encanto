<template>
  <main class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative py-20 md:py-28 bg-secondary/20">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl font-serif font-semibold text-gray-900 mb-6">
            Nuestra historia
          </h1>
          <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
            Desde 1995, endulzando los momentos más especiales con pasión, 
            tradición y los mejores ingredientes.
          </p>
        </div>
      </div>
    </section>

    <!-- Historia -->
    <section class="py-20 md:py-28">
      <div class="container">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-6">
              Una tradición familiar
            </h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Todo comenzó en la pequeña cocina de Doña Elena, una abuela apasionada por la repostería 
                que dedicaba horas a preparar los postres más deliciosos para su familia. Sus recetas, 
                heredadas de generación en generación, combinaban técnicas tradicionales con un toque 
                de innovación.
              </p>
              <p>
                Lo que empezó como un hobby, pronto se convirtió en un sueño compartido. En 1995, 
                con el apoyo de su familia, Doña Elena abrió las puertas de "DulceEncanto" en el 
                corazón de la ciudad. Su filosofía era simple pero poderosa: usar ingredientes 
                naturales, preparar todo con amor y ofrecer productos frescos cada día.
              </p>
              <p>
                Hoy, tres décadas después, seguimos honrando ese legado. Cada pastel, cada galleta 
                y cada cupcake que sale de nuestra cocina lleva consigo la misma pasión y dedicación 
                que nos ha caracterizado desde el primer día.
              </p>
            </div>
          </div>
          <div class="order-1 md:order-2">
            <div class="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&h=600&fit=crop" 
                alt="Nuestra pastelería"
                class="w-full h-auto object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div class="relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop" 
                  alt="Galletas artesanales"
                  class="w-full h-32 object-cover"
                />
              </div>
              <div class="relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" 
                  alt="Pasteles decorados"
                  class="w-full h-32 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="py-20 bg-gray-50">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
            Nuestros valores
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto">
            Lo que nos impulsa a seguir creando momentos dulces cada día
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-serif font-semibold mb-3">Pasión</h3>
            <p class="text-gray-500">
              Amamos lo que hacemos y eso se refleja en cada detalle de nuestros productos.
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 class="text-xl font-serif font-semibold mb-3">Calidad</h3>
            <p class="text-gray-500">
              Ingredientes naturales y frescos, seleccionados cuidadosamente cada día.
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-serif font-semibold mb-3">Tradición</h3>
            <p class="text-gray-500">
              Recetas familiares que han pasado de generación en generación.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Equipo -->
    <section class="py-20">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
            Nuestro equipo
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto">
            Los artesanos detrás de tus postres favoritos
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="member in team" :key="member.name" class="text-center group">
            <div class="relative rounded-2xl overflow-hidden mb-4 aspect-square">
              <img 
                :src="member.image" 
                :alt="member.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 class="text-lg font-serif font-semibold text-gray-900">{{ member.name }}</h3>
            <p class="text-primary text-sm">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-primary text-white">
      <div class="container text-center">
        <h2 class="text-3xl md:text-4xl font-serif font-semibold mb-4">
          ¿Quieres probar nuestras delicias?
        </h2>
        <p class="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Visítanos en nuestra tienda o haz tu pedido en línea. ¡Te esperamos!
        </p>
        <button 
          @click="goToProducts"
          class="px-8 py-4 bg-white text-primary rounded-full font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          Ver productos
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const team = [
  {
    name: 'Elena Rodríguez',
    role: 'Fundadora & Maestra Pastelera',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
  },
  {
    name: 'Carlos Méndez',
    role: 'Chef Pastelero',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
  },
  {
    name: 'María Fernández',
    role: 'Especialista en Decoración',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
  },
  {
    name: 'Ana Martínez',
    role: 'Atención al Cliente',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop'
  }
]

const goToProducts = () => {
  router.push('/productos')
}
</script>