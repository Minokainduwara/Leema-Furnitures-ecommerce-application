// src/pages/ProductDetail.tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductImageGallery from '@/components/User-Components/ProductCardComponent/ProductImageGallery'
import PaymentPanel from '@/components/User-Components/ProductCardComponent/PaymentPanel'
import ProductCard from '@/components/User-Components/Category-Componanent/ProductCard'

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState<any>(null)
    const [similarProducts, setSimilarProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        // Fetch main product details
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct({
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    // The backend returns 'image' as a string filename
                    images: data.image ? [`http://localhost:8080/uploads/${data.image}`] : ['/placeholder.png'],
                    description: data.description || 'Compliment your room interior with a modern touch...',
                    sku: data.sku || 'Modular Wardrobe',
                    warranty: '10 year comprehensive warranty',
                    delivery: 'Free Delivery up to 25 km',
                })
            })
            .catch(err => console.error("Failed to fetch product:", err))

        // Fetch similar/related products
        fetch(`http://localhost:8080/api/products/${id}/related`)
            .then(res => res.json())
            .then(data => {
                const formatted = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    sub: item.sku || "N/A",
                    price: item.price,
                    discount: 0,
                    category: item.categoryName || "Uncategorized",
                    type: "All",
                    img: item.image ? `http://localhost:8080/uploads/${item.image}` : ""
                }))
                setSimilarProducts(formatted)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch related products:", err)
                setLoading(false)
            })

        // Scroll to top when id changes
        window.scrollTo(0, 0)
    }, [id])

    if (loading || !product) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading product details...</div>
    }

    return (
        <div className="max-w-5xl mx-auto bg-gray-50 px-4 py-8">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <ProductImageGallery images={product.images} name={product.name} />
                <PaymentPanel price={product.price} />
            </div>

            {/* Info Banner */}
            <div className="grid grid-cols-3 bg-white text-black rounded p-6 gap-4 mb-10 shadow-sm">
                <div>
                    <p className="font-semibold">{product.sku}</p>
                    <p className="text-sm mt-1 text-gray-600">{product.description}</p>
                </div>
                <div className="flex items-center">
                    <p className="font-semibold text-gray-800"> {product.delivery}</p>
                </div>
                <div className="flex items-center">
                    <p className="font-semibold text-gray-800"> {product.warranty}</p>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <>
                    <h2 className="text-center text-xl font-bold text-orange-700 mb-6">SIMILAR PRODUCTS</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {similarProducts.map(p => (
                            <Link to={`/product/${p.id}`} key={p.id}>
                                <ProductCard product={p} />
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default ProductDetail