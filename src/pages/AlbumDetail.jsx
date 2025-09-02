import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbum, addProducts, reorder } from "../lib/albumsApi.js";
import toAbsUrl from "../lib/toAbsUrl.js";
import defaultImg from "../assets/default-img.jpg"
import { ProductCardAlbum } from "../components/ProductCard.jsx";

export default function AlbumDetail(props) {
  const params = useParams();
  const shopId = props.shopId ?? params.shopId ?? params.id;
  const slug   = props.slug   ?? params.slug;

  const [album, setAlbum] = useState(null);
  const [newIds, setNewIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    if (!shopId || !slug) return;
    try {
      setErr("");
      setLoading(true);
      const data = await getAlbum(shopId, slug);
      setAlbum(data);
    } catch (e) {
      console.error("getAlbum error:", e);
      setErr(e?.response?.data?.message || "Không tải được album.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shopId || !slug) {
      setErr("Thiếu tham số URL: shopId hoặc slug.");
      return;
    }
    load();
  }, [shopId, slug]);

  const onAdd = async () => {
    try {
      const ids = newIds.split(",").map(s => s.trim()).filter(Boolean);
      if (ids.length === 0) return;

      await addProducts(album._id, ids); 
      setNewIds("");
      await load();
    } catch (e) {
      console.error("addProducts error:", e);
      setErr(e?.response?.data?.message || "Add product fail.");
    }
  };

  const onReorder = async () => {
    try {
      const ordered = album.items.map(i => i.product._id);
      await reorder(album._id, ordered); 
      await load();
    } catch (e) {
      console.error("reorder error:", e);
      setErr(e?.response?.data?.message || "Lưu thứ tự thất bại.");
    }
  };

  if (!shopId || !slug) {
    return <div className="p-4 text-sm text-red-600">Thiếu tham số URL: shopId hoặc slug.</div>;
  }

  if (loading && !album) return <div className="p-4">Đang tải...</div>;
  if (err && !album)     return <div className="p-4 text-red-600">{err}</div>;
  if (!album)            return null;

  // console.log(
  //   "items len =", album?.items?.length,
  //   "img =", getImg(album?.items?.[0]?.product),
  //   album?.items?.[0]?.product,
  //   "url =", toAbsUrl(album?.items?.[0]?.product.image)
  // );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{album.name}</h1>
      {album.description && <p className="text-gray-600">{album.description}</p>}

      {/* Add products quickly 
      <div className="mt-4 flex gap-2">
        <input
          value={newIds}
          onChange={(e) => setNewIds(e.target.value)}
          placeholder="Nhập productIds, phân tách bằng dấu phẩy"
          className="rounded-md px-3 py-2 border flex-1"
        />
        <button className="px-4 py-2 rounded-md border" onClick={onAdd}>
          Add Product
        </button>
      </div>
      */}

      {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

      <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {album.items?.map((i) => (
          <ProductCardAlbum key={i.product._id} p={i.product} />
        ))}
      </ul>

    </div>
  );
}
