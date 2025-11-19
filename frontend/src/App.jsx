import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ProductDetail from './pages/ProductDetail';
import CreateBlog from './create/CreateBlogUi';
import AddProduct from './create/AddProducts';
import Login from './users/login';
import Register from './users/register';
import Profile from './users/userprofile';
import ShopHomePage from './pages/Shop-HomePage';
import ShopAlbums from './pages/shopAlbums';
import AlbumDetail from './pages/AlbumDetail';
import CreateShop from './create/CreateShop';
import CreateAlbum from './create/CreateAlbum';
import Albums from './pages/Albums';
import Contact from './pages/Contact';


//navigate to user shop
function ShopHomeAlias() {
  const shopId = localStorage.getItem('shopId');
  if (!shopId) return <Navigate to="/shop" replace />;
  return <Navigate to={`/shop/${shopId}`} replace />;
}

function App() {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideLayout && <Navbar />}

      <main className={`flex-1 ${hideLayout ? '' : 'pt-16'}`} role="main">
        {hideLayout ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <div className="mx-auto max-w-7xl w-full px-6 py-10">
            <Routes>
              <Route path="/my-shop" element={<ShopHomeAlias />} />

              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/createBlog" element={<CreateBlog />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/shop/:shopId" element={<ShopHomePage />} />
              <Route path="/shop/:shopId/albums" element={<ShopAlbums />} />
              <Route path="/shop/:shopId/albums/:slug" element={<AlbumDetail />} />
              <Route path="/shop/create" element={<CreateShop />} />
              <Route path="/shop/:shopId/albums/new" element={<CreateAlbum />} />

              <Route path="*" element={<div className="p-6 text-red-600">404 – Page not found</div>} />
            </Routes>
          </div>
        )}
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
