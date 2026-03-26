<template>
  <section class="py-20">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
          Síguenos en Instagram
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          @dulceencanto - Comparte tus momentos dulces con nosotros
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="post in instagramPosts"
          :key="post.id"
          class="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
        >
          <img
            :src="post.image"
            :alt="post.alt"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="text-center mt-8">
        <a
          href="https://instagram.com/dulceencanto"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
          </svg>
          Seguir en Instagram
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
const instagramPosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', alt: 'Tarta de fresa' },
  { id: 2, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop', alt: 'Cupcakes' },
  { id: 3, image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=400&fit=crop', alt: 'Macarons' },
  { id: 4, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop', alt: 'Cheesecake' }
]
</script>