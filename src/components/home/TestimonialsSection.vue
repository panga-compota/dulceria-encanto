<template>
  <section class="py-20 bg-gray-50">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Más de 10,000 clientes satisfechos nos respaldan
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-1 mb-4">
            <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p class="text-gray-600 mb-4 italic">"{{ testimonial.text }}"</p>
          <div class="flex items-center gap-3">
            <img
              :src="testimonial.avatar"
              :alt="testimonial.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
              <p class="text-xs text-gray-500">{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Cliente recurrente',
    text: 'Los pasteles de DulceEncanto son simplemente espectaculares. Pedí uno para mi boda y todos quedaron encantados. La calidad y el sabor son inigualables.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: 'Carlos López',
    role: 'Cliente frecuente',
    text: 'Las mejores galletas que he probado. Se nota que usan ingredientes de calidad y el servicio al cliente es excelente. ¡100% recomendados!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    role: 'Cliente recurrente',
    text: 'Pedí cupcakes para el cumpleaños de mi hija y fueron un éxito. Además, el empaque es hermoso y llegaron en perfectas condiciones.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  }
]
</script>