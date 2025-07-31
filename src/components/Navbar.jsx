import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="fixed w-full bg-gray-800 text-white p-4 flex items-center ">
    <h1 className="font-bold text-xl p-1"><Link to="/">BlogShop</Link></h1>
    <div className='search-bar pl-4 pr-4 text-black'>

      <form className="flex w-80">
        <input 
          type="text" 
          placeholder="Tìm kiếm..." 
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-opacity-50"
        >
          🔍
        </button>
    </form>

    </div>
    <div className="flex gap-4 text-center">
      <Link to="/">Home</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/blog">Blog</Link>
    </div>
  </nav>
);

export default Navbar;
