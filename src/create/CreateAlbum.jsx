import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api"; // 


export default function CreateAlbum({ onSuccess }) {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]); 
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  console.log('params =', shopId, slug);

  // ---------- helpers ----------
  const slugify = (text) =>
    text
      .toString()
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "") 
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") 
      .replace(/\s+/g, "-") 
      .replace(/-+/g, "-"); 


  useEffect(() => {
    if (!name) return setSlug("");
    setSlug((curr) => {
      if (!curr || curr === slugify(curr)) return slugify(name);
      return curr;
    });
  }, [name]);

  const canSubmit = useMemo(() => name.trim() && slug.trim(), [name, slug]);

  // ---------- fetch products (optional step) ----------
  useEffect(() => {
    if (!shopId) return;
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await api.get(`/products/shop/${shopId}`, { params: { limit: 100 } });
        setProducts(res.data || []);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [shopId]);

  console.log(shopId)

  const toggleSelect = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ---------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || !shopId) return;

    setIsSubmitting(true);
    setError("");

    try {
      const payload = { name: name.trim(), slug: slug.trim(), description: description.trim() };
      const createRes = await api.post(`/albums/shop/${shopId}`, payload);
      const album = createRes.data;

      if (selectedProductIds.length > 0 && album?._id) {
        await api.post(`/albums/${album._id}/items`, { productIds: selectedProductIds });
      }

      if (onSuccess) onSuccess(album);
      else navigate(`/shop/${shopId}/albums/${album?.slug || slug}`);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Tạo album thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Tạo album mới</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 rounded-xl shadow">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Tên album <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Hot Deals 9.9"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL) <span className="text-gray-500 text-xs">tự tạo từ tên, có thể sửa</span></label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="hot-deals-9-9"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn về album..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Optional pick products */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Chọn sản phẩm thêm vào ngay</label>
            {loadingProducts && <span className="text-xs text-gray-500">Đang tải sản phẩm...</span>}
          </div>

          <div className="max-h-56 overflow-auto mt-2 rounded border border-gray-200 divide-y">
            {products?.length === 0 && !loadingProducts && (
              <div className="p-3 text-sm text-gray-500">Không có sản phẩm hoặc chưa tải được.</div>
            )}
            {products?.map((p) => (
              <label key={p._id} className="flex items-center gap-3 p-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(p._id)}
                  onChange={() => toggleSelect(p._id)}
                />
                <span className="line-clamp-1">{p.name} {p.price ? `— ${Number(p.price).toLocaleString()}₫` : ""}</span>
              </label>
            ))}
          </div>
          {selectedProductIds.length > 0 && (
            <div className="text-xs text-gray-600 mt-1">Đã chọn {selectedProductIds.length} sản phẩm</div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting ? "Đang tạo..." : "Tạo album"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border px-4 py-2"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
