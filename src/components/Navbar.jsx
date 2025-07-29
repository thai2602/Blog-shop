import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4 flex justify-between">
    <h1 className="font-bold text-xl"><Link to="/">BlogShop</Link></h1>
    <div className="flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/blog">Blog</Link>
    </div>
  </nav>
);

export default Navbar;
