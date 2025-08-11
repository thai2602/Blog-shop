import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { CiUser } from "react-icons/ci";


const Navbar = () => (
  <nav id = "navbar" className="fixed w-full bg-white text-black h-16 p-4 flex items-center z-50">
    <h1 className="font-bold text-2xl p-1"><Link to="/">BlogShop</Link></h1>
    <div className='search-bar pl-4 pr-4 text-black'>
      <div>
        <form className="flex w-80 hover:border rounded-full">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="flex-grow px-4 py-2 border-gray-300 rounded-l-full focus:outline-none"
          />
          <button 
            type="submit" 
            className="brg text-white px-4 py-2 rounded-r-md hover:bg-opacity-50"
          >
            <IoIosSearch color='black' />
          </button>
        </form>
      </div>
      

    </div>
    <div className="flex gap-4 text-center font-semibold">
      <Link className="hover:opacity-50" to="/">Home</Link>
      <Link className="hover:opacity-50" to="/shop">Shop</Link>
      <Link className="hover:opacity-50" to="/blog">Blog</Link>
      
    </div>
    <div className=" flex gap-4 text-center ml-auto mr-4">
      <Link to="/profile" className="text-white hover:text-gray-300">
          <CiUser size={25} color='black' />
      </Link>
    </div>
  </nav>
);

export default Navbar;
