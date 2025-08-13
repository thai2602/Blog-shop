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
    <div id = "blog-page" className="main-blog mx-32 mb-4 font-sans">
      <h2 className="text-2xl font-bold mb-4">Popular</h2>
      <div className="page flex w-full">
        <div className="main-page w-5/6 pr-12">
          <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
        <div className="sub-page w-1/6">
          <div className='w-full pb-2 text-xl'>Categories</div>
            <ul className="flex-col gap-y-4 w-fit">
              <li className='hover:font-semibold'><Link>Foods</Link></li>
              <li className='hover:font-semibold'><Link>Drinks</Link></li>
              <li className='hover:font-semibold'><Link>Trips</Link></li>
              <li className='hover:font-semibold'><Link>Spring</Link></li>
              <li className='hover:font-semibold'><Link>Summer</Link></li>
              <li className='hover:font-semibold'><Link>Autumn</Link></li>
              <li className='hover:font-semibold'><Link>Winter</Link></li>
            </ul>
        </div>
      </div>

        <div id = "create-blog-btn" className="w-fit text-white font-semibold p-2 bg-green-600 hover:opacity-75 mx-4 my-2 rounded-lg"> 
          <Link to="/create">Create Blog</Link> 
        </div>

    </div>
  );
};

export default Blog;
