import React from 'react';
import { products } from '../data/products';
import { Link } from 'react-router-dom';

const Shop = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Shop</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.id} className="border p-4 rounded shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
          <p className="text-gray-700 mb-2">{p.price}</p>
          <Link to={`/product/${p.id}`} className="text-blue-500 hover:underline">
            View
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default Shop;
