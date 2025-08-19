import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';
import { CiShop } from "react-icons/ci";
import { TbCategory } from "react-icons/tb";
import { BiSolidOffer } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import { API_URL } from '../config';
import api from "../lib/api";   

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p?.category?.name === selectedCategory)
    : products;

  useEffect(() => {
    Promise.all([
      api.get(`${API_URL}/products`),
      api.get(`${API_URL}/productCategories`)
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (v) =>
    typeof v === 'number'
      ? v.toLocaleString('vi-VN') + ' ₫'
      : `${v} VNĐ`;

  return (
    <div id="shop-page" className="space-y-8">
      <header className="pt-2">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Categories header */}
            <button
              onClick={() => setOpenCategories(!openCategories)}
              className="w-full flex items-center gap-2 px-4 py-3 border-b border-gray-200 text-gray-800 hover:bg-gray-50"
            >
              <TbCategory size={20} />
              <span className="font-semibold">Categories</span>
              <span className="ml-auto text-gray-400">{openCategories ? '▾' : '▸'}</span>
            </button>

            {/* Categories list */}
            <div className={`transition-[max-height] duration-300 ${openCategories ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
              <nav className="py-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-5 py-2.5 text-sm rounded-none hover:bg-gray-50
                      ${selectedCategory === cat.name ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'}`}
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Show All
                </button>
              </nav>
            </div>

            <div className="border-t border-gray-200">
              <Link className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <BiSolidOffer size={18} />
                <span>Best Offers</span>
              </Link>
              <Link className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <CiShop size={18} />
                <span>Sell with us</span>
              </Link>
              <Link className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <FaShippingFast size={18} />
                <span>Track Order</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <section className="min-w-0">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Products</h2>
            {selectedCategory && (
              <span className="text-sm text-gray-500">
                Đang lọc theo: <span className="font-medium text-gray-700">{selectedCategory}</span>
              </span>
            )}
          </div>

          {loading ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 animate-pulse">
                  <div className="rounded-xl bg-gray-200 aspect-[4/3]" />
                  <div className="h-4 bg-gray-200 rounded mt-4 w-2/3" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="
                    group bg-white rounded-2xl border border-gray-200 shadow-sm
                    hover:shadow-md hover:-translate-y-0.5 transition
                    block overflow-hidden
                  "
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image ? `${API_URL}${p.image}` : defaultImg}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{p?.category?.name || "No category"}</p>
                    <p className="mt-2 font-semibold text-gray-900">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>


      <div className="flex justify-end">
        <Link
          to="/addproduct"
          className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-green-700 active:scale-[0.98] transition"
        >
          Add Item
        </Link>
      </div>
    </div>
  );
};

export default Shop;
