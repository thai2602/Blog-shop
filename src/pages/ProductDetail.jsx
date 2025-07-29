import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="text-lg">{product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetail;
