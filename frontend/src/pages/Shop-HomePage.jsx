import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listAlbums } from "../lib/albumsApi.js";
import api from "../lib/api";
import { API_URL } from "../config/index";
import { THEMES } from "../config/themeLibrary";
import { COMPONENT_MAP } from "../components/dynamic/componentLibrary";
import ChatBot from "../components/ChatBot/ChatBot";
import defaultBg from "../assets/backrough-default.jpg";

// Map simple section names to component keys
const SECTION_MAPPING = {
  products: "product_grid",
  story: "story_section",
  album: "gallery_grid",
  contact: "shop_info_card"
};

// Initial Configuration (Default)
const INITIAL_CONFIG = {
  // Default Palette (Ocean Blue equivalent)
  colorPalette: {
    primary: "#2563eb",   // blue-600
    secondary: "#dbeafe", // blue-100
    background: "#eff6ff",// blue-50
    text: "#1e3a8a",      // blue-900
    accent: "#1d4ed8"     // blue-700
  },
  layoutMode: "standard",
  heroContent: {
    title: "Crafted with Passion",
    subtitle: "Served with Love",
    buttonText: "Shop Now"
  },
  activeSections: ["contact", "products", "story", "album"]
};

export default function ShopHomePage() {
  const navigate = useNavigate();
  const { shopId } = useParams();

  // Data State
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loadingShop, setLoadingShop] = useState(true);
  const [shopError, setShopError] = useState("");

  // Design Config State
  const [designConfig, setDesignConfig] = useState(INITIAL_CONFIG);

  const toAbsUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
    return url;
  };

  // Fetch Data (Keeping existing logic)
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
          setShopError(err?.response?.data?.message || "Load shop failed");
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
    api.get(`/products/shop/${shopId}`)
      .then(res => setProducts(res.data || []))
      .catch(console.error);
    listAlbums(shopId)
      .then(data => {
        const items = data?.items ?? [];
        setAlbums(items.map(a => ({ ...a, coverImage: a.coverImage ? toAbsUrl(a.coverImage) : null })));
      })
      .catch(console.error);
  }, [shopId]);

  // Derived Styles - Helper to pass down if needed, but mainly we rely on CSS vars now
  const themeStyles = {
    // We can pass the raw palette if components need to calculate derived values
    palette: designConfig.colorPalette,
    borderStyles: { rounded: "rounded-lg", shadowHard: "shadow-xl" }
  };

  const componentData = { shop, products, albums };

  if (loadingShop) return <div className="p-6 text-gray-600">Loading shop...</div>;
  if (shopError) return <div className="p-6 text-red-600">{shopError}</div>;
  if (!shop) return <div className="p-6 text-gray-600">Shop not found.</div>;

  return (
    <>
      {/* AI ChatBot (Isolated from Page Theme) */}
      <ChatBot onUpdateDesign={setDesignConfig} />

      {/*
         THEME POOL
         Injecting dynamic colors as CSS variables.
         All children can now use var(--theme-primary), etc.
      */}
      <div
        className="min-h-screen transition-colors duration-500 font-sans"
        style={{
          "--theme-primary": designConfig.colorPalette.primary,
          "--theme-secondary": designConfig.colorPalette.secondary,
          "--theme-background": designConfig.colorPalette.background,
          "--theme-text": designConfig.colorPalette.text,
          "--theme-accent": designConfig.colorPalette.accent,
          backgroundColor: "var(--theme-background)",
          color: "var(--theme-text)"
        }}
      >
        {/* Dynamic Header / Hero */}
        <header className={`relative w-full overflow-hidden ${designConfig.layoutMode === 'split_screen' ? 'flex flex-col md:flex-row h-auto' : 'h-[500px]'}`}>
          {/* Background / Image Area */}
          <div className={`absolute inset-0 z-0 ${designConfig.layoutMode === 'split_screen' ? 'relative order-2 md:w-1/2 h-[400px] md:h-auto' : ''}`}>
            <img
              src={shop.avatar ? toAbsUrl(shop.avatar) : defaultBg}
              className="w-full h-full object-cover"
              onError={(e) => e.currentTarget.src = defaultBg}
              alt="Hero"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content Area */}
          <div className={`relative z-10 flex flex-col justify-center px-6 ${designConfig.layoutMode === 'split_screen'
            ? 'order-1 md:w-1/2 py-20 bg-opacity-0 text-[var(--theme-text)]'
            : 'h-full text-center text-white items-center'
            }`}>
            <h1 className={`text-5xl md:text-7xl font-bold mb-4 leading-tight ${designConfig.layoutMode === 'split_screen' ? 'text-[var(--theme-primary)]' : 'text-white'}`}>
              {designConfig.heroContent.title}
            </h1>
            <p className={`text-xl md:text-2xl mb-8 opacity-90 max-w-2xl ${designConfig.layoutMode !== 'split_screen' ? 'text-gray-200' : ''}`}>
              {designConfig.heroContent.subtitle}
            </p>
            <button
              className="px-8 py-4 rounded-full font-bold text-lg transition shadow-lg hover:brightness-110"
              style={{
                backgroundColor: "var(--theme-primary)",
                color: "#ffffff" // Assuming primary is always dark enough, or we could add a contrast text var
              }}
            >
              {designConfig.heroContent.buttonText}
            </button>
          </div>
        </header>

        {/* Dynamic Sections */}
        <main className="py-12 space-y-20">
          {designConfig.activeSections.map((sectionKey) => {
            const componentKey = SECTION_MAPPING[sectionKey];
            const Component = COMPONENT_MAP[componentKey];

            if (!Component) return null;

            return (
              <div key={sectionKey} className="animate-fade-in-up">
                <Component
                  data={componentData}
                  themeStyles={themeStyles}
                />
              </div>
            );
          })}
        </main>
      </div>
    </>
  );
}
