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
          <Link
            to="/shop/create"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Create Shop
          </Link>
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

      {loading && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-black text-white px-3 py-2 text-sm shadow">
          Loading data......
        </div>
      )}
    </div>
  );
};

export default Home;
