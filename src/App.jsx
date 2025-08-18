import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ProductDetail from './pages/ProductDetail';
import CreateBlog from './blog-create/CreateBlogUi';
import AddProduct from './blog-create/AddProducts';
import Login from './users/login';
import Register from './users/register';
import Profile from './users/userprofile';
import ShopHomePage from './pages/Shop-HomePage';

function App() {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
      <div className="flex flex-col min-h-screen bg-white">
        {!hideLayout && <Navbar />}
        <main className={`flex-1 p-4 ${!hideLayout ? 'mt-20' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shophomepage" element={<ShopHomePage />} />
          </Routes>
        </main>
        {!hideLayout && <Footer />}
      </div>
  );
}

export default App;
