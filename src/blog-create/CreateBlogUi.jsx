import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateBlog = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]); 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: null,
    categories: [], 
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, categories: selected }));
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
    data.append('title', formData.title);
    data.append('summary', formData.summary);
    data.append('content', formData.content);
    data.append('categories', JSON.stringify(selectedCategories));
    if (formData.image) data.append('image', formData.image);
    formData.categories.forEach(catId => data.append('categories', catId));

    try {
      await axios.post('http://localhost:5000/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/Blog');
    } catch (err) {
      console.error('Lỗi khi gửi bài viết:', err);
    }
  };

  return (
    <div id="create-blog" className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Tạo Bài Viết Mới</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-medium mb-1">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mô tả ngắn</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Nội dung</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Chọn categories */}
        <div>
          <label className="block font-medium mb-1">Chọn chuyên mục</label>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <label key={cat._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat._id}
                  checked={selectedCategories.includes(cat._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories(prev => [...prev, cat._id]);
                    } else {
                      setSelectedCategories(prev => prev.filter(id => id !== cat._id));
                    }
                  }}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 max-h-60 rounded-lg border" />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Đăng bài
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
