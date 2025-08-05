import React, { useEffect, useState } from 'react';
import { products } from '../data/products'; 
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Lỗi khi tải bài viết:', err));
  }, []);

  return (
    <div id = "home-page" className="space-y-8 p-4">
      <section>
        <h2 className="text-xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{p.name}</h3>
              <p>{p.price}</p>
              <Link to={`/product/${p.id}`} className="text-blue-500 hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <div key={post._id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm">{post.summary}</p>
              <Link to={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
