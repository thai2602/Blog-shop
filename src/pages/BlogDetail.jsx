import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultImg from '../assets/default-img.jpg';


const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/${slug}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [slug]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div id = "blog-detail" className="flex ml-24 mr-24 mt-8">
      <img src={post.image 
      ? `http://localhost:5000${post.image}`
      : defaultImg } 
      alt={post.title} className="w-64 h-40 object-cover" />
      <div className="blog-title mx-4"> 
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>
      
    </div>
  );
};

export default BlogDetail;
