import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import defaultImg from '../assets/default-img.jpg'
import RelatedBlogsVertical from '../sub/RelatedBlog'

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/posts/${slug}`);
        setPost(data); 

        const { data: allPosts } = await axios.get(`http://localhost:5000/posts`);
        if (Array.isArray(allPosts)) {
          const filtered = allPosts
            .filter(p => p.slug !== slug) 
            .slice(0, 5); 
          setRelatedPosts(filtered);
        } else {
          setRelatedPosts([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Load faild.');
      }
    };
    fetchData();
  }, [slug]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>Loading...</p>;

  const bgUrl = post.image
    ? (post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`)
    : defaultImg;

  return (
    <div id="blog-detail-page" className="flex flex-col lg:flex-row mx-64 mt-8 gap-8">
      <div className="flex-1 shadow rounded">
        <div
          className="w-full h-80 bg-cover bg-center relative rounded-lg overflow-hidden shadow"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
            <p className="text-sm text-gray-300">
              {new Date(post.createdAt).toDateString()}
            </p>
            <h2 className="text-2xl font-semibold leading-snug mb-3">
              {post.title}
            </h2>
            <div className="flex gap-2 mb-4">
              {post.isFeatured && (
                <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs rounded-full">
                  Featured
                </span>
              )}
              <span className="px-3 py-1 bg-white/90 text-gray-800 text-xs rounded-full">
                {post.category}
              </span>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded w-max">
              Intro
            </button>
          </div>
        </div>
        <div className="blog-title mx-8 mt-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="mt-4 text-gray-700 whitespace-pre-line">{post.content}</p>
        </div>
      </div>

      {/* Related blogs sidebar */}
      <div className="w-60">
        <RelatedBlogsVertical posts={relatedPosts} />
      </div>
    </div>
  );
}
