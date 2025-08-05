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
    <div id = "blog-detail-page" className="flex flex-col mx-64 mt-8">

      <div
        className="w-full h-80 bg-cover bg-center relative rounded-lg overflow-hidden shadow"
        style={{
          backgroundImage: `url(${post.image ? `http://localhost:5000${post.image}` : defaultImg})`,
        }}
      >
        {/* Overlay đen mờ */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Nội dung nằm trên ảnh */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
          <p className="text-sm text-gray-300">{new Date(post.createdAt).toDateString()}</p>
          <h2 className="text-2xl font-semibold leading-snug mb-3">{post.title}</h2>

          <div className="flex gap-2 mb-4">
            {post.isFeatured && (
              <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs rounded-full">Featured</span>
            )}
            <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs rounded-full">{post.category}</span>
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded w-max">
            Intro
          </button>
        </div>
      </div>

      <div className="blog-title mx-4"> 
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>
      
    </div>
  );
};

export default BlogDetail;
