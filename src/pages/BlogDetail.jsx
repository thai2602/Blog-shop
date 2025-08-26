import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import defaultImg from '../assets/default-img.jpg'
import RelatedBlogsVertical from '../sub/RelatedBlog'
import UserInfoCard from '../sub/UserInfoCard'

import api from '../lib/api';
import toAbsUrl from '../lib/toAbsUrl';

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
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data); 

        const { data: allPosts } = await api.get(`/posts`);
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
  
  const bgUrl = post.image ? toAbsUrl(post.image) : defaultImg;

  return (
    <div id="blog-detail-page" className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
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


      <div className="w-60 bg-white h-fit">
        <UserInfoCard userId = {post.userId._id} />
        <RelatedBlogsVertical posts={relatedPosts} />
      </div>
    </div>
  );
}
