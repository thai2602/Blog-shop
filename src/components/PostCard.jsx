import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ title, description }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
