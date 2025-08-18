import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FiPlusCircle } from "react-icons/fi";
import SubNav from '../sub/Subnav';



export default function Navbar () {
  const subItems = [
    {
      name: <FiPlusCircle size={25} />,
      subMenu: [
        <Link className="inline-block h-full w-full hover:opacity-50" to="/">Home</Link>, 
        <Link className="inline-block h-full w-full hover:opacity-50" to="/addproduct">Add Product</Link>,
        <Link className="inline-block h-full w-full hover:opacity-50" to="/create">Create Blog</Link>,
        <Link className="inline-block h-full w-full hover:opacity-50" to="/shophomepage">Shop Page</Link>,
      ]
    },
    //{ name: "Liên hệ" },
  ]
  return (
    <nav id = "navbar" className="fixed w-full bg-white text-black h-20 p-4 flex items-center z-50">
      <h1 className="font-bold text-2xl p-1"><Link to="/">BlogShop</Link></h1>
      <div className='search-bar pl-4 pr-4 h-full items-center text-black'>
        <div className='h-full py-1'>
          <form className="flex w-80 h-full focus-within:border-2 hover:border-2 rounded-full ">
            <input 
              type="text" 
              placeholder="Search..." 
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
      <div className=" flex gap-4 text-center ml-auto mr-4 items-center">
        <div className='flex p-4 items-center'>
            <SubNav items={subItems} title='test' />
        </div>

        <Link to="/profile" className="text-white hover:text-gray-300">
            <CiUser size={25} color='black' />
        </Link>
      </div>
    </nav>
  );
}
  

