import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import defaultImg from '../assets/default-img.jpg'
import RelatedProductsVertical from '../sub/RelatedProducts'
import API_URL from '../config'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/${slug}`)
        setProduct(data)

        const { data: allProducts } = await axios.get(`${API_URL}/products`)

        if (Array.isArray(allProducts)) {
          const filtered = allProducts
            .filter(
              p =>
                p.slug !== slug &&
                String(p.category?._id) === String(data.category?._id)
            )
            .slice(0, 5);
          setRelatedProducts(filtered);
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Load failed.')
      }
    }
    fetchData()
  }, [slug])

  if (error) return <p className="text-red-500">{error}</p>
  if (!product) return <p>Loading...</p>

  const imgUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${API_URL}${product.image}`
    : defaultImg

  return (
    <div id="product-detail-page" className="flex flex-col lg:flex-row mx-64 mt-8 gap-8">
      <div className="flex-1 shadow rounded bg-white p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full md:w-1/2 object-cover rounded-lg"
            onError={(e) => (e.target.src = defaultImg)}
          />
          <div>
            <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
            <p className="text-xl text-green-600 font-semibold mb-2">
              {product.price?.toLocaleString('vi-VN')} VNĐ
            </p>
            <p className="mb-4 text-gray-700">{product.description}</p>
            <div className="text-sm text-gray-500 mb-2">
              Danh mục:  {product.category?.name || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">
              Tồn kho: {product.quantity}
            </div>
            {product.isFeatured && (
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Sản phẩm nổi bật
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-60 bg-white shadow">
        <RelatedProductsVertical products={relatedProducts} />
      </div>
    </div>
  )
}
