import React from 'react'
import { Link } from 'react-router-dom'
import defaultImg from '../assets/default-img.jpg'
import API_URL from '../config'

export default function RelatedProductsVertical({ products = [], title = 'Related Products' }) {
  // Hàm xử lý ảnh an toàn
  const getImageUrl = (img) => {
    if (!img) return defaultImg
    return img.startsWith('http') ? img : `${API_URL}${img}`
  }

  return (
    <aside className="w-full max-w-md">
      <h3 className="text-lg font-semibold mb-3 px-3">{title}</h3>

      <div className="flex flex-col gap-3">
        {products.length === 0 ? (
          <div className="px-3 py-4 bg-white rounded-lg shadow-sm text-sm text-gray-500">
            Không có sản phẩm liên quan.
          </div>
        ) : (
          products.map((p) => {
            const imgSrc = getImageUrl(p.image || (p.images && p.images[0]))
            return (
              <Link
                key={p.id || p.slug}
                to={p.slug ? `/product/${p.slug}` : '#'}
                className="group flex items-start gap-3 bg-white rounded-lg p-3 hover:shadow-lg transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              >

                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={imgSrc}
                    alt={p.name || 'Product'}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = defaultImg)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                    {p.name || 'Không có tên sản phẩm'}
                  </h4>

                  <div className="mt-1 text-sm font-semibold text-red-500">
                    {p.price != null
                      ? p.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                      : 'Liên hệ'}
                  </div>

                  <div className="mt-0.5 text-xs text-gray-500">
                    {p.quantity > 0 ? `Còn ${p.quantity} sản phẩm` : 'Hết hàng'}
                  </div>

                  {p.category && (
                    <div className="mt-1 text-xs text-gray-400 italic">
                      {p.category?.name || 'Không có danh mục'}
                    </div>
                  )}
                </div>
              </Link>
            )
          })
        )}
      </div>
    </aside>
  )
}
