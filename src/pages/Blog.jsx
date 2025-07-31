import React from 'react';
import { posts } from '../data/posts';
import PostCard from '../components/PostCard';

const Blog = () => (
  <div className="main-blog ml-24 mr-24 mb-4">
    <h2 className="text-2xl font-bold mb-4">Blog</h2>
    <div className="grid grid-cols-1 gap-4">
      {posts.map(post => <PostCard key = {post.slug} post = {post} />)}
    </div>
  </div>
);

export default Blog;
