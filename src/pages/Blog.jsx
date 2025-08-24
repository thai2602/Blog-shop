import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';

import api from '../lib/api';


const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    api.get(`/posts`)
      .then(res => setPosts(res.data))
      .catch(err => console.error('Lỗi khi tải bài viết:', err));
  }, []);

    useEffect(() => {
    api.get(`/categories`)
      .then(res => {
        setCategories(res.data)
      })
      .catch(err => console.error('Lỗi khi tải categories:', err));
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter(post =>
        post.categories?.some(cat => cat.slug === selectedCategory)
      )
    : posts;

  return (
    <div id="blog-page" className="main-blog mt-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      <div className="page flex w-full">
        <div className="main-page w-5/6 pr-12">
          <h2 className="text-3xl font-bold mb-4 capitalize">
            {selectedCategory ? `Related: ${selectedCategory}` : "Popular"}
          </h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <p>No posts found for this category.</p>
            )}
          </div>
        </div>

        <div className="sub-page w-1/6">
          <div className="w-full pb-2 text-xl font-semibold border-b border-gray-300 mb-3">
            Categories
          </div>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat._id}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left px-2 py-1 rounded-md transition duration-200
                    ${selectedCategory === cat.slug 
                      ? "font-semibold text-black" 
                      : "text-gray-700 hover:font-semibold hover:scale-[1.02]"}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left px-2 py-1 rounded-md transition duration-200
                  ${selectedCategory === null
                    ? "font-semibold text-black"
                    : "text-gray-700 hover:font-semibold hover:scale-[1.02]"}`}
              >
                Show All
              </button>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Blog;

// useEffect(() => {
// console.log("Posts from API:", posts);
// }, [posts]);