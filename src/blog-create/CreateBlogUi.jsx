import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const CreateBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: null, 
  });

  const [preview, setPreview] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));

      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('summary', formData.summary);
    data.append('content', formData.content);
    if (formData.image) data.append('image', formData.image);

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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">📝 Tạo Bài Viết Mới</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Nhập tiêu đề bài viết"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Tóm tắt nội dung chính"
            required
          />
        </div>
         {/*  */}
        <div>
          <label className="block font-medium mb-1">Nội dung</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Viết nội dung bài viết..."
            required
          />
        </div>
       {/*img */}
        <div>
          <label className="block font-medium mb-1">Ảnh đại diện</label>
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

        {/* sumit btn*/}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Đăng bài
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
