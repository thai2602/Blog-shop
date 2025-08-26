import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';
import RelatedProductsVertical from '../sub/RelatedProducts';
import { API_URL } from '../config';
import api from '../lib/api';
import ShopInfoCard from '../sub/ShopInfoCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);

        const { data: allProducts } = await api.get(`/products`);
        if (Array.isArray(allProducts)) {
          const filtered = allProducts
            .filter(
              (p) =>
                p.slug !== slug &&
                String(p.category?._id) === String(data.category?._id)
            )
            .slice(0, 5);
          setRelatedProducts(filtered);
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || 'Load failed.');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (error) return <p className="text-red-500">{error}</p>;

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-6 animate-pulse">
            <div className="rounded-xl bg-gray-200 aspect-square" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded" />
              <div className="h-6 w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-[400px]" />
      </div>
    );
  }

  if (!product) return null;

  const imgUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`)
    : defaultImg;

  return (

    <div id="product-detail-page" className="grid gap-8 lg:grid-cols-[1fr_320px]">

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">

          <div className="rounded-xl overflow-hidden bg-gray-100">
            <img
              src={imgUrl}
              alt={product.name}
              className="w-full h-full object-cover aspect-square"
              onError={(e) => { e.currentTarget.src = defaultImg; }}
            />
          </div>


          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {typeof product.price === 'number'
                ? product.price.toLocaleString('vi-VN') + ' ₫'
                : `${product.price} VNĐ`}
            </p>

            {product.isFeatured && (
              <span className="mt-3 inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                Outstanding Products
              </span>
            )}

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><span className="text-gray-500">Categories:</span> {product.category?.name || 'N/A'}</p>
              <p><span className="text-gray-500">Quantity:</span> {product.quantity}</p>
            </div>

            {product.description && (
              <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button className="rounded-xl bg-black text-white px-4 py-2 font-semibold hover:opacity-90 active:scale-[0.98] transition">
                Add to Cart
              </button>
              <button className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50 active:scale-[0.98] transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="lg:sticky lg:top-24">
        <ShopInfoCard shopId = {product.shopId}  />
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3">Related Products</h2>
          <RelatedProductsVertical products={relatedProducts} />
        </div>
      </aside>
    </div>
  );
}
