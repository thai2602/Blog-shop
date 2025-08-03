import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Lỗi khi tải bài viết:', err));
  }, []);

  return (
    <div className="main-blog ml-24 mr-24 mb-4">
      <h2 className="text-2xl font-bold mb-4">Blog</h2>
      <div className="page flex">
        <div className="main-page w-3/5">
          <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
        <div className="sub-page w-2/5">
          <Link to="/create">Create Blog</Link>
          <ul className="px-4 flex-col gap-y-4">
            <li>Những lời hứa bỏ quên</li>
            <li>Những lời hứa bỏ quên</li>
            <li>Những lời hứa bỏ quên</li>
            <li>Những lời hứa bỏ quên</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;
