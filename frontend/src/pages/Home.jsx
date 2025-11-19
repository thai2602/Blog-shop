import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { API_URL } from "../config";
import api from "../lib/api";                

import defaultBG from "../assets/backrough-default.jpg";
import defaultImg from "../assets/default-img.jpg";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const productRef = useRef(null);
  const postRef = useRef(null);

  const [current, setCurrent] = useState(0);
  const visiblePosts = Array.isArray(posts) ? posts.slice(0, 5) : [];


  const goTo = (i) => {
    const el = postRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = postRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent(idx);
  };

  const joinUrl = (base, path) => {
    if (!path) return base;
    const b = String(base).replace(/\/+$/, "");
    const p = String(path).replace(/^\/+/, "");
    return `${b}/${p}`;
  };

  const parseArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
  };

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const [postRes, productRes] = await Promise.all([
          api.get("/posts", { signal: controller.signal }),
          api.get("/products", { signal: controller.signal }),
        ]);

        const postsList = parseArray(postRes?.data);
        const productsList = parseArray(productRes?.data);

        if (!cancelled) {
          setPosts(postsList);
          setProducts(productsList);
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error("Error when load data:", err);
        if (!cancelled) {
          setPosts([]);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const scrollLeft = (ref) =>
    ref.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = (ref) =>
    ref.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div id="home-page" className="bg-white text-black min-h-screen">
      {/* HERO */}
      <section
        className="relative h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: `url(${defaultBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center max-w-2xl">
          <img
            src={defaultImg}
            alt="hero"
            className="mx-auto mb-6 w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to BlogShop
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            Discover products & stories in a minimal black & white style
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to showcase your products and share your stories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Albums */}
            <Link
              to="/albums"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Albums</h3>
              <p className="text-gray-600 mb-4">
                Organize your products into beautiful collections and galleries
              </p>
              <span className="inline-flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                Browse Albums
                <svg
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Products */}
            <Link
              to="/shop"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Products</h3>
              <p className="text-gray-600 mb-4">
                Discover unique products from creative shops around the world
              </p>
              <span className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                Visit Store
                <svg
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Blog */}
            <Link
              to="/blog"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Blog</h3>
              <p className="text-gray-600 mb-4">
                Read inspiring stories, tips, and insights from our community
              </p>
              <span className="inline-flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                Read Articles
                <svg
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-600 mb-4">
                Get in touch with us for support, questions, or partnerships
              </p>
              <span className="inline-flex items-center text-red-600 font-semibold group-hover:gap-2 transition-all">
                Contact Us
                <svg
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BlogShop?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A platform designed for creators, sellers, and storytellers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Easy to Use
              </h3>
              <p className="text-gray-600">
                Create your shop and start selling in minutes with our intuitive interface
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Connect with other creators and grow your audience together
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Your data is safe with us. Focus on creating, we handle the rest
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <div className="space-x-2">
              <button
                onClick={() => scrollLeft(productRef)}
                className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
              >
                ◀
              </button>
              <button
                onClick={() => scrollRight(productRef)}
                className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
              >
                ▶
              </button>
            </div>
          </div>

          <div
            ref={productRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {Array.isArray(products) &&
              products.map((p, idx) => {
                const imgSrc = p?.image
                  ? (String(p.image).startsWith("http")
                      ? p.image
                      : joinUrl(API_URL, p.image))
                  : defaultImg;
                const slug = p?.slug || p?._id || p?.id;

                return (
                  <div
                    key={p?._id || p?.id || p?.slug || `p-${idx}`}
                    className="snap-start relative min-w-[280px] h-72 rounded-2xl overflow-hidden shadow-lg group"
                  >
                    <img
                      src={imgSrc}
                      alt={p?.name || "product"}
                      onError={(e) => (e.currentTarget.src = defaultImg)}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 p-4 text-white">
                      <h3 className="text-lg font-semibold line-clamp-1">
                        {p?.name || "Unnamed"}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {typeof p?.price === "number"
                          ? p.price.toLocaleString("vi-VN") + " ₫"
                          : p?.price || ""}
                      </p>
                      {slug && (
                        <Link
                          to={`/product/${slug}`}
                          className="mt-3 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="relative">
          <h2 className="text-3xl font-bold mb-6">Latest Blog Posts</h2>

          <div className="relative group">
            <div
              ref={postRef}
              onScroll={onScroll}
              className="w-full overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory flex"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {Array.isArray(visiblePosts) &&
                visiblePosts.map((post, idx) => {
                  const imgSrc = post?.image
                    ? (String(post.image).startsWith("http")
                        ? post.image
                        : joinUrl(API_URL, post.image))
                    : defaultImg;

                  return (
                    <div
                      key={post?._id || post?.id || post?.slug || `post-${idx}`}
                      className="snap-start w-full flex-none h-[420px] md:h-[500px] relative rounded-2xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={imgSrc}
                        alt={post?.title || "post"}
                        onError={(e) => (e.currentTarget.src = defaultImg)}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 p-6 text-white max-w-2xl">
                        <h3 className="text-3xl font-bold mb-2 line-clamp-2">
                          {post?.title || "Untitled"}
                        </h3>
                        <p className="text-white/80 text-base line-clamp-3">
                          {post?.summary || ""}
                        </p>
                        {post?.slug && (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200"
                            >
                            Read more
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => scrollLeft(postRef)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Previous"
            >
              ◀
            </button>
            <button
              onClick={() => scrollRight(postRef)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Next"
            >
              ▶
            </button>

            {Array.isArray(visiblePosts) && visiblePosts.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
                  {visiblePosts.map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`pointer-events-auto h-2.5 rounded-full transition-all ${
                        current === i
                          ? "w-6 bg-white"
                          : "w-2.5 bg-white/60 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already sharing their products and stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop/create"
              className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition shadow-lg"
            >
              Create Your Shop
            </Link>
            <Link
              to="/createBlog"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition"
            >
              Write a Blog Post
            </Link>
          </div>
        </div>
      </section>

      {loading && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-black text-white px-3 py-2 text-sm shadow">
          Loading data......
        </div>
      )}
    </div>
  );
};

export default Home;
