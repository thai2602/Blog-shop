import React from 'react';
import { posts } from '../data/posts';
import PostCard from '../components/PostCard';

const Blog = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Blog</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map(post => <PostCard key={post.slug} post={post} />)}
    </div>
  </div>
);

export default Blog;
