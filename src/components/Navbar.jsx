import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineLogin } from "react-icons/md";
import SubNav from "../sub/Subnav";

export default function Navbar() {
  const { pathname } = useLocation();
  const isActive = (p) =>
    pathname === p
      ? "text-white border-b-2 border-red-500 pb-1"
      : "text-gray-300 hover:text-white";

  const subItems = [
    {
      name: (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 hover:text-white hover:bg-gray-700">
          <FiPlusCircle size={20} />
        </span>
      ),
      subMenu: [
        <Link className="block px-4 py-2 hover:bg-gray-100" to="/">Home</Link>,
        <Link className="block px-4 py-2 hover:bg-gray-100" to="/addproduct">Add Product</Link>,
        <Link className="block px-4 py-2 hover:bg-gray-100" to="/create">Create Blog</Link>,
        <Link className="block px-4 py-2 hover:bg-gray-100" to="/shop/me">Shop Page</Link>,
        <Link className="block px-4 py-2 hover:bg-gray-100" to="/shop">Shop</Link>,
        <Link className="block px-4 py-2 hover:bg-gray-100" to="/blog">Blog</Link>,
        <Link className="block px-4 py-2 hover:bg-gray-100" to="/shop/create">Create Shop</Link>,
      ],
    },
  ];

  const [keyword, setKeyword] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    setKeyword("");
  };

return (
  <nav className="fixed inset-x-0 top-0 z-50 bg-white backdrop-blur border-b border-gray-200 shadow-sm">
    <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
      {/* Logo */}
      <Link
        to="/"
        className="text-black font-bold text-2xl tracking-wide hover:opacity-80"
      >
        BlogShop
      </Link>

      {/* Search */}
      <form onSubmit={onSearch} className="hidden md:block flex-1">
        <div className="relative mx-auto max-w-xl">
          {/* Input */}
          <input
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="
              w-full py-3 pl-4 pr-28
              rounded-full bg-white
              border border-gray-300
              text-gray-800 placeholder-gray-400
              shadow-sm outline-none
              focus:border-gray-500 focus:ring-2 focus:ring-gray-100
              transition
            "
          />

          <div className="absolute inset-y-0 right-12 flex items-center gap-3 px-2">
            {/* Clear (×) — chỉ hiện khi có text */}
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Clear search input"
              >
                ×
              </button>
            )}

            {/* Dropdown trigger */}
            <button
              type="button"
              className="text-gray-600 hover:text-black text-sm"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              Categories ▾
            </button>
          </div>

          <button
            type="submit"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              h-9 w-9 rounded-full
              bg-gray-700 text-white
              grid place-items-center
              shadow-md hover:bg-gray-800 active:scale-95
              outline-none focus:ring-2 focus:ring-gray-200
              transition z-10
            "
            aria-label="Search"
          >
            <IoIosSearch size={18} />
          </button>
        </div>
      </form>



      {/* Menu */}
      <div className="hidden md:flex h-16 items-center gap-6 text-md font-semibold">
        <Link
          to="/"
          className="
            relative inline-flex items-center h-10 leading-none
            text-gray-700 hover:text-black
            [&.active]:text-black [&.active]:after:w-full
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:h-[2px] after:w-0 after:bg-red-500 after:transition-all
          "
        >
          Home
        </Link>

        <Link
          to="/shop"
          className="
            relative inline-flex items-center h-10 leading-none
            text-gray-700 hover:text-black
            [&.active]:text-black [&.active]:after:w-full
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:h-[2px] after:w-0 after:bg-red-500 after:transition-all
          "
        >
          Shop
        </Link>

        <Link
          to="/blog"
          className="
            relative inline-flex items-center h-10 leading-none
            text-gray-700 hover:text-black
            [&.active]:text-black [&.active]:after:w-full
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:h-[2px] after:w-0 after:bg-red-500 after:transition-all
          "
        >
          Blog
        </Link>

        <Link
          to="/login"
          className="
            relative inline-flex items-center h-10 leading-none
            text-gray-700 hover:text-black
            [&.active]:text-black [&.active]:after:w-full
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:h-[2px] after:w-0 after:bg-red-500 after:transition-all
          "
        >
          <MdOutlineLogin size={20}/>
        </Link>
      </div>


      {/* Actions */}
      <div className="ml-auto flex items-center gap-2">
        <SubNav items={subItems} title="more" />
        <Link
          to="/profile"
          className="rounded-full p-2 text-gray-600 hover:text-black"
        >
          <FaRegUser size={20}/>
        </Link>
      </div>
    </div>
  </nav>
);

}
