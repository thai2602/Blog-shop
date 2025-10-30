import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../lib/api";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: null,
    categories: [], 
  });

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erro loading categories:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (catId, checked) => {
    setFormData(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, catId]
        : prev.categories.filter(id => id !== catId),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, image: file }));
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('summary', formData.summary);
      data.append('content', formData.content);

      data.append('categories', JSON.stringify(formData.categories));

      if (formData.image) data.append('image', formData.image);

      await api.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' },

      });

      navigate('/blog'); 
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error when submitting article';
      console.error(msg, err);
      alert(msg.includes('duplicate') || msg.includes('11000')
        ? 'Title already exists, please change to another title.'
        : msg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  

  return (
    <div id="create-blog" className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Title</label>
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
          <label className="block font-medium mb-1">Short description</label>
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
          <label className="block font-medium mb-1">Content</label>
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
          <label className="block font-medium mb-1">Select category</label>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <label key={cat._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat._id}
                  checked={formData.categories.includes(cat._id)}
                  onChange={(e) => toggleCategory(cat._id, e.target.checked)}
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

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
