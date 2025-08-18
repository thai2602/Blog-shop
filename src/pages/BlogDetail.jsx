import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import defaultImg from '../assets/default-img.jpg'
import RelatedBlogsVertical from '../sub/RelatedBlog'
import API_URL from '../config'

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(null);

  const words = post?.content ? post.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.round(words / 200));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/posts/${slug}`);
        setPost(data); 

        const { data: allPosts } = await axios.get(`${API_URL}/posts`);
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
    ? (post.image.startsWith('http') ? post.image : `${API_URL}${post.image}`)
    : defaultImg;

  return (
    <div id="blog-detail-page" className="max-w-6xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 rounded-xl shadow-md overflow-hidden bg-white">
        <div
          className="relative h-80 w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 text-white">

            <p className="text-xs text-gray-200">
              {new Date(post.createdAt).toDateString()}
            </p>

            <h2 className="mb-3 text-2xl font-semibold leading-snug">
              {post.title}
            </h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {post.isFeatured && (
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm">
                  Featured
                </span>
              )}
              {post?.categories?.map((c) => (
                <span
                  key={c._id}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm"
                >
                  {c.name}
                </span>
              ))}
            </div>

            <button className="w-max rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600">
              Intro
            </button>
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>

            <article className="prose max-w-none prose-p:my-4 prose-img:rounded-lg mt-4 text-gray-800">
              <p className="whitespace-pre-line">{post.content}</p>
            </article>
        </div>
      </div>


      <div className="w-60 bg-white">
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || defaultImg}
              alt={post.author?.name || "Shop"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{post.author?.name || "Shop"}</p>
              <p className="text-sm text-gray-500">Owner</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Sharing our passion and products with love 💖
          </p>
        </div>
        <RelatedBlogsVertical posts={relatedPosts} />
      </div>
    </div>
  );
}
