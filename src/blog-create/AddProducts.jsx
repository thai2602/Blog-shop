import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    details: '',
    price: '',
    quantity: '',
    category: '',
    isFeatured: false,
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // 📌 Lấy danh mục khi load trang
  useEffect(() => {
    axios.get("http://localhost:5000/productCategories")
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error("❌ Lỗi khi tải categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post('http://localhost:5000/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ Thêm sản phẩm thành công!');
      navigate('/shop'); 
    } catch (err) {
      console.error('❌ Lỗi khi thêm sản phẩm:', err);
      alert('Lỗi khi gửi sản phẩm lên server!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Thêm Sản Phẩm Mới</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          name="description"
          placeholder="Mô tả ngắn"
          value={formData.description}
          onChange={handleChange}
          rows="2"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          name="details"
          placeholder="Chi tiết sản phẩm"
          value={formData.details}
          onChange={handleChange}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Số lượng"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Danh mục</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <label htmlFor="isFeatured" className="text-sm">Sản phẩm nổi bật</label>
        </div>

        <div>
          <label className="block font-medium mb-1">Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 max-h-60 rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
