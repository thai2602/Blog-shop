import React from 'react';
import { useParams } from 'react-router-dom';
import { posts } from '../data/posts';

const BlogDetail = () => {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="mt-4">{post.content}</p>
    </div>
  );
};

export default BlogDetail;
