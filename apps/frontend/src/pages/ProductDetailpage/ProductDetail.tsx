// src/pages/ProductDetail.tsx
import { useParams } from 'react-router-dom'
import ProductImageGallery from '@/components/ProductCardComponent/ProductImageGallery'
import PaymentPanel from '@/components/ProductCardComponent/PaymentPanel'
import ProductCard from '@/components/Category-Componanent/ProductCard'

const ProductDetail = () => {
  const { id } = useParams()

  // Replace with real API call using your FastAPI backend
  const product = {
    id,
    name: 'Sectional Sofa Set',
    price: 53000,
    images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'],
    description: 'Compliment your room interior with a modern touch...',
    sku: 'Modular Wardrobe',
    warranty: '10 year comprehensive warranty',
    delivery: 'Free Delivery up to 25 km',
  }

  const similarProducts = [
    { id: 2, name: 'Sectional Sofa', category: 'Sofa', sub: '3-seater', price: 53000, discount: 0, img: '/s1.jpg' },
    { id: 3, name: 'Sectional Sofa', category: 'Sofa', sub: '2-seater', price: 53000, discount: 10, img: '/s2.jpg' },
    { id: 4, name: 'Sectional Sofa', category: 'Sofa', sub: 'L-shape', price: 53000, discount: 5, img: '/s3.jpg' },
  ]

  return (
    <div className="max-w-5xl mx-auto bg-amber-200 px-4 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <ProductImageGallery images={product.images} name={product.name} />
        <PaymentPanel price={product.price} />
      </div>

      {/* Info Banner */}
      <div className="grid grid-cols-3 bg-green-700 text-white rounded p-6 gap-4 mb-10">
        <div>
          <p className="font-semibold">{product.sku}</p>
          <p className="text-sm">{product.description}</p>
        </div>
        <div>
          <p className="font-semibold">🚚 {product.delivery}</p>
        </div>
        <div>
          <p className="font-semibold">🛡 {product.warranty}</p>
        </div>
      </div>

      {/* Similar Products */}
      <h2 className="text-center text-xl font-bold text-orange-700 mb-4">SIMILAR PRODUCT</h2>
      <div className="grid grid-cols-3 gap-4">
        {similarProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

export default ProductDetail