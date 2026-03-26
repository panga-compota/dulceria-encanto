import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllProducts } from '@/data/products'

export const useProductsStore = defineStore('products', () => {
        // Estado
        const allProducts = ref([])
        const selectedCategory = ref('todos')
        const searchQuery = ref('')
        const currentPage = ref(1)
        const itemsPerPage = ref(8)
        const sortBy = ref('default') // default, price-asc, price-desc, name-asc, name-desc

        // Computed: productos filtrados
        const filteredProducts = computed(() => {
                let products = [...allProducts.value]

                // Filtro por categoría
                if (selectedCategory.value !== 'todos') {
                        products = products.filter(p => p.category.toLowerCase() === selectedCategory.value.toLowerCase())
                }

                // Filtro por búsqueda
                if (searchQuery.value.trim()) {
                        const query = searchQuery.value.toLowerCase()
                        products = products.filter(p =>
                                p.name.toLowerCase().includes(query) ||
                                p.description.toLowerCase().includes(query) ||
                                p.category.toLowerCase().includes(query)
                        )
                }

                // Ordenamiento
                switch (sortBy.value) {
                        case 'price-asc':
                                products.sort((a, b) => {
                                        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price
                                        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price
                                        return priceA - priceB
                                })
                                break
                        case 'price-desc':
                                products.sort((a, b) => {
                                        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price
                                        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price
                                        return priceB - priceA
                                })
                                break
                        case 'name-asc':
                                products.sort((a, b) => a.name.localeCompare(b.name))
                                break
                        case 'name-desc':
                                products.sort((a, b) => b.name.localeCompare(a.name))
                                break
                        default:
                                // Mantener orden original (por ID)
                                products.sort((a, b) => a.id - b.id)
                }

                return products
        })

        // Computed: categorías únicas
        const categories = computed(() => {
                const cats = new Set(allProducts.value.map(p => p.category))
                return ['todos', ...Array.from(cats)]
        })

        // Computed: total de páginas
        const totalPages = computed(() => {
                return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
        })

        // Computed: productos paginados
        const paginatedProducts = computed(() => {
                const start = (currentPage.value - 1) * itemsPerPage.value
                const end = start + itemsPerPage.value
                return filteredProducts.value.slice(start, end)
        })

        // Computed: resultado de la búsqueda
        const productsCount = computed(() => filteredProducts.value.length)

        // Acciones
        const loadProducts = () => {
                allProducts.value = getAllProducts()
        }

        const setCategory = (category) => {
                selectedCategory.value = category
                currentPage.value = 1
        }

        const setSearchQuery = (query) => {
                searchQuery.value = query
                currentPage.value = 1
        }

        const setSortBy = (sort) => {
                sortBy.value = sort
                currentPage.value = 1
        }

        const setPage = (page) => {
                if (page >= 1 && page <= totalPages.value) {
                        currentPage.value = page
                }
        }

        const resetFilters = () => {
                selectedCategory.value = 'todos'
                searchQuery.value = ''
                sortBy.value = 'default'
                currentPage.value = 1
        }

        return {
                // Estado
                allProducts,
                selectedCategory,
                searchQuery,
                currentPage,
                itemsPerPage,
                sortBy,
                // Getters
                filteredProducts,
                categories,
                totalPages,
                paginatedProducts,
                productsCount,
                // Acciones
                loadProducts,
                setCategory,
                setSearchQuery,
                setSortBy,
                setPage,
                resetFilters
        }
})