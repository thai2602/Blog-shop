import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPhone, FaEnvelope, FaFacebook } from "react-icons/fa";
import { listAlbums } from "../lib/albumsApi.js";
import api from "../lib/api";
import { API_URL } from "../config";

import defaultImg from "../assets/default-img.jpg";
import defaultBG from "../assets/backrough-default.jpg";
import ProductCard from "../components/ProductCard.jsx";
import IsolatedArticle from "../components/Article.jsx";
import CoffeeDesireStory from "../components/ArticleTemplate.jsx";

export default function ShopHomePage() {
  const navigate = useNavigate();
  const { shopId } = useParams();   

  const [shop, setShop] = useState(null);
  const [loadingShop, setLoadingShop] = useState(true);
  const [shopError, setShopError] = useState("");

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState("products");

  const [albums, setAlbums] = useState([]);
  const [loadingAlbum, setLoadingAlbum] = useState(false);

  const storyLink = "https://docs.google.com/document/d/1i36LFS0K7pns89Nci-deUX2WTqZhbZJS/edit?usp=sharing&ouid=105937149956991319130&rtpof=true&sd=true"

  const toAbsUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
    return url;
  };
  useEffect(() => {
    if (!shopId) return;
    let cancel = false;
    (async () => {
      try {
        setLoadingShop(true);
        setShopError("");
        const res = await api.get(`/shop/id/${shopId}`); 
        if (!cancel) setShop(res.data);
      } catch (err) {
        if (!cancel) {
          const msg = err?.response?.data?.message || "Load shop is fail";
          setShopError(msg);
          setShop(null);
        }
      } finally {
        if (!cancel) setLoadingShop(false);
      }
    })();
    return () => { cancel = true; };
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;
    let cancel = false;
    setLoadingProducts(true);
    api.get(`/products/shop/${shopId}`)
      .then(res => { if (!cancel) setProducts(res.data || []); })
      .catch(err => console.error("Error when load products:", err))
      .finally(() => { if (!cancel) setLoadingProducts(false); });
    return () => { cancel = true; };
  }, [shopId]);


  useEffect(() => {
    if (activeTab !== "album" || !shopId) return;
    let cancel = false;
    setLoadingAlbum(true);
    listAlbums(shopId)
      .then((data) => {
        if (cancel) return;
        const items = data?.items ?? [];
        setAlbums(
          items.map((a) => ({
            ...a,
            coverImage: a.coverImage ? toAbsUrl(a.coverImage) : defaultImg,
          }))
        );
      })
      .finally(() => { if (!cancel) setLoadingAlbum(false); });
    return () => { cancel = true; };
  }, [activeTab, shopId]);

  const slides = (() => {
    const raw = [
      ...(Array.isArray(shop?.images) ? shop.images : []),
      ...(shop?.avatar ? [shop.avatar] : []),
    ]
      .map((s) => s && s.trim())
      .filter(Boolean)
      .map(toAbsUrl);
    return raw.length ? raw : [defaultBG];
  })();

  const slidesLen = slides.length;
  const nextSlide = () => setCurrent((p) => (p + 1) % slidesLen);
  const prevSlide = () => setCurrent((p) => (p - 1 + slidesLen) % slidesLen);

  if (loadingShop) return <div className="p-6 text-gray-600">Loading shop...</div>;
  if (shopError) { return <div className="p-6 text-red-600">{shopError}</div>;}
  if (!shop)       return (
    <div className="p-6">
      <p className="text-gray-600">Shop not exist.</p>
      <button
        onClick={() => navigate("/shop/create")}
        className="mt-3 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
      >
        Create Shop
      </button>
    </div>
  );

  const phone = shop?.contact?.phone;
  const email = shop?.contact?.email;
  const facebook = shop?.contact?.facebook;
  const address = shop?.contact?.address;
  const year = shop?.createdAt ? new Date(shop.createdAt).getFullYear() : null;


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* HERO */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={slides[current]}
          alt="hero"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.src = defaultImg)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

        {slidesLen > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:opacity-100"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:opacity-100"
            >
              ❯
            </button>
          </>
        )}
      </section>

      {/* CARD INFO */}
      <section className="-mt-16">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="relative rounded-xl border border-gray-200 bg-white/90 shadow-sm backdrop-blur-sm">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <img
                src={toAbsUrl(shop.avatar) || defaultImg}
                alt="avatar"
                className="h-28 w-28 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                onError={(e) => (e.currentTarget.src = defaultImg)}
              />
            </div>

            <div className="px-6 pb-8 pt-16 text-center sm:px-8">
              <h2 className="text-xl font-semibold tracking-tight">{shop.name || "Shop"}</h2>
              <p className="mt-1 text-gray-600">
                {address ? `${address} • ` : ""}
                {year ? `Since ${year}` : ""}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                  >
                    <FaPhone className="opacity-70" /> {phone}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                  >
                    <FaEnvelope className="opacity-70" /> {email}
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                  >
                    <FaFacebook className="opacity-70" /> Facebook
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sticky top-0 z-10 mt-6 px-4 bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-4xl border-b px-1 sm:px-2">
              <div className="flex gap-6">
                {["products", "story", "album"].map((tab) => {
                  const active = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative pb-3 pt-3 text-sm font-semibold tracking-wide transition ${
                        active ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {tab === "products" && "Products"}
                      {tab === "story" && "Story"}
                      {tab === "album" && "Album"}
                      {active && <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        {activeTab === "products" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-gray-500">
                No products yet. Add your first product ✨
              </div>
            ) : (
              products.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))
            )}
          </div>
        )}

        {activeTab === "story" && (
          <section className="rounded-xl bg-white p-6 shadow">
            <CoffeeDesireStory />
            
          </section>
        )}

        {activeTab === "album" && (
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-3 text-xl font-semibold">Product Albums</h2>
            {loadingAlbum && <p className="text-gray-500">Loading...</p>}
            {!loadingAlbum && albums.length === 0 && (
              <p className="text-gray-500">No albums yet.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {albums.map((album) => (
                <div 
                  key={album._id} 
                  className="rounded-lg border p-4 shadow hover:shadow-md cursor-pointer"
                  onClick={() => navigate(`/shop/${shop._id}/albums/${album.slug}`)}
                  >
                  <img
                    src={album.coverImage || defaultImg}
                    alt={album.name}
                    className="h-32 w-full object-cover rounded-md"
                    onError={(e) => (e.currentTarget.src = defaultImg)}
                  />
                  <h3 className="mt-2 font-semibold">{album.name}</h3>
                  {album.theme && <p className="text-sm text-gray-500">{album.theme}</p>}
                  {"productCount" in album && (
                    <p className="text-xs text-gray-400">{album.productCount} products</p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate(`/shop/${shop._id}/albums/new`)}
              className="mt-6 rounded-lg bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-600"
            >
              + New album
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
