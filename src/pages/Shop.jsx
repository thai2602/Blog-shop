import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';
import { CiShop } from "react-icons/ci";
import { TbCategory } from "react-icons/tb";
import { BiSolidOffer } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div id="shop-page" className="p-4">
      <div className='shop-info flex'>
        <h2 className="text-2xl font-bold mb-4">Shop</h2>

      </div>
          
      <div className="shop flex">
        <div className='w-1/5 mr-4'>
    
          <Link className='flex items-center p-4 bg-red-700 text-gray-50 font-serif hover:opacity-60'> <TbCategory size={25} /> Categories </Link>

          <Link className='flex pt-3 pl-4  items-center hover:font-semibold hover:text-black text-gray-500'> <BiSolidOffer size={25} /> Best Offers</Link>
          
          <Link className='flex pt-3 pl-4 items-center hover:font-semibold hover:text-black text-gray-500'> <CiShop size={25}  /> Sell with us</Link>

          <Link className='flex pt-3 pl-4 items-center hover:font-semibold hover:text-black text-gray-500'> <FaShippingFast size={25} /> Track Order</Link>

        </div>
        
        <div className='products w-full'>
          <h2 className='text-3xl py-4 font-bold '>Products</h2>
        {loading ? (
          <p>Đang tải sản phẩm...</p>
          ) : (
            <div className="mr-16  grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
              {products.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition duration-200 block"
                >
                  <div className="w-[250px] h-[160px] mx-auto overflow-hidden rounded-lg mb-3">
                    <img
                      src={p.image ? `http://localhost:5000${p.image}` : defaultImg}
                      alt={p.name}
                      className="w-[250px] h-[160px] object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                  <p className="text-gray-700 mb-2">{p.price} VNĐ</p>
                </Link>
              ))}
            </div>
          )}     
        </div>
      </div>
      <div
        id="addproduct-btn"
        className="w-fit text-white font-semibold p-2 bg-green-600 hover:opacity-75 mx-4 my-2 rounded-lg"
      >
        <Link to="/addproduct">Add Item</Link>
      </div>
    </div>
  );
};

export default Shop;
