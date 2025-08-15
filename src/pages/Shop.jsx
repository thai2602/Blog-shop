import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';
import { CiShop } from "react-icons/ci";
import { TbCategory } from "react-icons/tb";
import { BiSolidOffer } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import API_URL from '../config';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = selectedCategory
  ? products.filter(p => p?.category?.name === selectedCategory)
  : products;

useEffect(() => {
  Promise.all([
    axios.get(`${API_URL}/products`),
    axios.get(`${API_URL}/productCategories`)
  ])
  .then(([productsRes, categoriesRes]) => {
    setProducts(productsRes.data);
    setCategories(categoriesRes.data);
  })
  .catch(err => console.error(err))
  .finally(() => setLoading(false));
}, []);

  return (
    <div id="shop-page" className="p-4">
      <div className='shop-info flex'>
        <h2 className="text-2xl font-bold mb-4">Shop</h2>
        
      </div>
          
      <div className="shop flex">
        <div className='w-1/5 mr-4'>
          <Link
                onClick={() => setOpenCategories(!openCategories)}
                className='flex items-center p-4 bg-red-700 text-gray-50 font-serif hover:opacity-60 cursor-pointer'
              >
                <TbCategory size={25} /> Categories
              </Link>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openCategories ? 'max-h-96' : 'max-h-0'
                }`}
              >
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`pl-10 py-2 hover:bg-gray-200 cursor-pointer ${
                      selectedCategory === cat.name ? "bg-gray-300 font-bold" : ""
                    }`}
                  >
                    {cat.name}
                  </div>
                ))}
                  <div
                    className="pl-10 py-2 hover:bg-gray-200 cursor-pointer font-semibold"
                    onClick={() => {
                      setSelectedCategory(null); // reset filter
                    }}
                  >
                    Show All
                  </div>
              </div>

              <Link className='flex pt-3 pl-4 items-center hover:font-semibold hover:text-black text-gray-500'>
                <BiSolidOffer size={25} /> Best Offers
              </Link>

              <Link className='flex pt-3 pl-4 items-center hover:font-semibold hover:text-black text-gray-500'>
                <CiShop size={25} /> Sell with us
              </Link>

              <Link className='flex pt-3 pl-4 items-center hover:font-semibold hover:text-black text-gray-500'>
                <FaShippingFast size={25} /> Track Order
              </Link>

          </div>
        
        <div className='products w-full'>
          <h2 className='text-3xl py-4 font-bold '>Products</h2>
        {loading ? (
          <p>Đang tải sản phẩm...</p>
          ) : (
            <div className="mr-16  grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
              {filteredProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition duration-200 block"
                >
                  <div className="w-[250px] h-[160px] mx-auto overflow-hidden rounded-lg mb-3">
                    <img
                      src={p.image ? `${API_URL}${p.image}` : defaultImg}
                      alt={p.name}
                      className="w-[250px] h-[160px] object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                  <p className="text-gray-700 mb-2">{p.price} VNĐ</p>
                  <p className="text-sm text-gray-500">{p?.category?.name || "No category"}</p>
                </Link>
              ))}
            </div>
          )}     
        </div>
      </div>
      <div
        id="addproduct-btn"
        className="w-fit text-white font-semibold p-2 bg-green-600 hover:opacity-75 mx-4 my-2 rounded-lg ml-auto"
      >
        <Link to="/addproduct">Add Item</Link>
      </div>
    </div>
  );
};

export default Shop;
