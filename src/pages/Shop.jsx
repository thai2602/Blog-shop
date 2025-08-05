import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';

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
      <h2 className="text-2xl font-bold mb-4">Shop</h2>

      <div
        id="addproduct-btn"
        className="w-fit text-white font-semibold p-2 bg-green-600 hover:opacity-75 mx-4 my-2 rounded-lg"
      >
        <Link to="/addproduct">Add Item</Link>
      </div>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition duration-200">
              <img src={p.image ? `http://localhost:5000${p.image}` : defaultImg} alt={p.name} className="h-48 w-full object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
              <p className="text-gray-700 mb-2">{p.price} VNĐ</p>
              <Link to={`/product/${p.slug}`} className="text-blue-500 hover:underline">
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
