import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import defaultImg from '../assets/default-img.jpg';

const ProductDetail = () => {
  const { slug } = useParams();  // dùng slug thay vì id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${slug}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p className="p-4">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="p-4 text-red-500">Không tìm thấy sản phẩm.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image ? `http://localhost:5000${product.image}` : defaultImg}
          alt={product.name}
          className="w-full md:w-1/2 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
          <p className="text-xl text-green-600 font-semibold mb-2">{product.price} VNĐ</p>
          <p className="mb-4 text-gray-700">{product.description}</p>
          <div className="text-sm text-gray-500 mb-2">Danh mục: {product.category}</div>
          <div className="text-sm text-gray-500">Tồn kho: {product.quantity}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
