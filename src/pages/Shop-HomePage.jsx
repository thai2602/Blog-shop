import { useState } from "react";
import { FaPhone, FaEnvelope, FaFacebook } from "react-icons/fa";
import defaultImg from "../assets/default-img.jpg";
import { listAlbums } from "../lib/albumsApi.js";
import { API_URL } from '../config';

const slides = [defaultImg];
const products = []; 

export default function ShopHomePage() {
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState("products");
  const [albums, setAlbums] = useState([]);
  const [loadingAlbum, setLoadingAlbum] = useState(false);

  useEffect(() => {
    if (activeTab === "album" && shopId) {
      setLoadingAlbum(true);
      listAlbums(shopId)
        .then((data) => setAlbums(data.items))
        .finally(() => setLoadingAlbum(false));
    }
  }, [activeTab, shopId]);

  const nextSlide = () => setCurrent((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      <section className="relative h-[70vh] w-full overflow-hidden">
        <img src={slides[current]} alt="hero" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

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
      </section>

    <section className="-mt-16">
        <div className="mx-auto w-full max-w-4xl px-4">
            <div className="relative rounded-xl border border-gray-200 bg-white/90 shadow-sm backdrop-blur-sm">
            
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <img
                    src={defaultImg}
                    alt="avatar"
                    className="h-28 w-28 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                    />
                </div>

                <div className="px-6 pb-8 pt-16 text-center sm:px-8">
                    <h2 className="text-xl font-semibold tracking-tight">Shop</h2>
                    <p className="mt-1 text-gray-600">Cake bakery • Since 2022</p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="tel:0123456789"
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                        >
                            <FaPhone className="opacity-70" /> 0123 456 789
                        </a>
                        <a
                            href="mailto:shopabc@gmail.com"
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                        >
                            <FaEnvelope className="opacity-70" /> shopabc@gmail.com
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                        >
                            <FaFacebook className="opacity-70" /> Facebook
                        </a>
                    </div>
                </div>
            </div>

            <div className="sticky top-0 z-10 mt-6 bg-white/80 backdrop-blur">
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

      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        {activeTab === "products" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-gray-500">
                No products yet. Add your first product ✨
              </div>
            ) : (
              products.map((p) => (
                <article key={p.id} className="rounded-xl bg-white p-4 shadow transition hover:shadow-md">
                  <img src={p.img} alt={p.name} className="h-44 w-full rounded-lg object-cover" />
                  <h3 className="mt-3 font-medium">{p.name}</h3>
                  <p className="font-semibold text-red-500">{p.price}</p>
                  <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700">
                    Buy now
                  </button>
                </article>
              ))
            )}
          </div>
        )}

        {activeTab === "story" && (
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-3 text-xl font-semibold">Our Story</h2>
            <p className="leading-relaxed text-gray-600">
              ABC Shop was founded in 2022 with the mission of bringing high-quality products to customers.
              We value trust and satisfaction above all.
            </p>
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
                >
                  <img
                    src={album.coverImage || defaultImg}
                    alt={album.name}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <h3 className="mt-2 font-semibold">{album.name}</h3>
                  <p className="text-sm text-gray-500">{album.theme}</p>
                  <p className="text-xs text-gray-400">
                    {album.productCount} products
                  </p>
                </div>
              ))}
            </div>

            <button className="mt-6 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
              + New album
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
