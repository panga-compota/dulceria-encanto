const API_URL = import.meta.env.VITE_API_URL
export const mockProducts = [
  {
    id: 1,
    name: 'Tarta de Fresa',
    category: 'Pasteles',
    description: 'Deliciosa tarta con fresas frescas y crema pastelera, cubierta con merengue italiano.',
    price: 450,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop',
    featured: true
  },
  {
    id: 2,
    name: 'Cupcakes de Vainilla',
    category: 'Cupcakes',
    description: 'Esponjosos cupcakes de vainilla con frosting de mantequilla y sprinkles de colores.',
    price: 120,
    oldPrice: 150,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&h=500&fit=crop',
    featured: true
  },
  {
    id: 3,
    name: 'Macarons Franceses',
    category: 'Galletas',
    description: 'Surtido de macarons en sabores: frambuesa, pistacho, chocolate y vainilla.',
    price: 280,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&h=500&fit=crop',
    featured: true
  },
  {
    id: 4,
    name: 'Cheesecake de Frutos Rojos',
    category: 'Pasteles',
    description: 'Cheesecake cremoso con coulis de frutos rojos y base de galleta crujiente.',
    price: 520,
    oldPrice: 580,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=500&fit=crop',
    featured: true
  },
  {
    id: 5,
    name: 'Galletas Decoradas',
    category: 'Galletas',
    description: 'Galletas de mantequilla decoradas con glaseado real, perfectas para regalar.',
    price: 180,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop',
    featured: true
  },
  {
    id: 6,
    name: 'Brownies de Chocolate',
    category: 'Postres',
    description: 'Brownies ultra chocolatosos con nueces y corazón de chocolate fundido.',
    price: 95,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=500&fit=crop',
    featured: true
  },
  {
    id: 7,
    name: 'Pastel de Chocolate',
    category: 'Pasteles',
    description: 'Pastel de chocolate belga con relleno de ganache y cobertura de chocolate.',
    price: 580,
    oldPrice: 650,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',
    featured: false
  },
  {
    id: 8,
    name: 'Cupcakes Red Velvet',
    category: 'Cupcakes',
    description: 'Cupcakes de terciopelo rojo con frosting de queso crema.',
    price: 135,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1612371316125-6db03b2841c1?w=500&h=500&fit=crop',
    featured: false
  },
  {
    id: 9,
    name: 'Alfajores de Maicena',
    category: 'Galletas',
    description: 'Alfajores suaves con dulce de leche y coco rallado.',
    price: 150,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1581410389195-3b4d00c9a4b2?w=500&h=500&fit=crop',
    featured: false
  },
  {
    id: 10,
    name: 'Trufas de Chocolate',
    category: 'Postres',
    description: 'Trufas artesanales de chocolate amargo con ganache de frambuesa.',
    price: 220,
    oldPrice: 280,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&h=500&fit=crop',
    featured: false
  },
  {
    id: 11,
    name: 'Pastel de Zanahoria',
    category: 'Pasteles',
    description: 'Pastel esponjoso de zanahoria con nueces y frosting de queso crema.',
    price: 490,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1579981729630-5e6cf2625711?w=500&h=500&fit=crop',
    featured: false
  },
  {
    id: 12,
    name: 'Cupcakes de Chocolate',
    category: 'Cupcakes',
    description: 'Cupcakes de chocolate intenso con frosting de mantequilla de chocolate.',
    price: 125,
    oldPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&h=500&fit=crop',
    featured: false
  }
]

export const getAllProducts = () => {
  return mockProducts
}

export const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.featured)
}

export const getProductsByCategory = (category) => {
  if (category === 'todos') return mockProducts
  return mockProducts.filter(product => product.category === category)
}