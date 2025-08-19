import { useEffect, useState } from 'react';
import { getAlbum, addProducts, reorder } from "../lib/albumsApi.js";

export default function AlbumDetail({ shopId, slug, token }) {
  const [album, setAlbum] = useState(null);
  const [newIds, setNewIds] = useState('');

  const load = async () => setAlbum(await getAlbum(shopId, slug));
  useEffect(()=>{ load(); }, [shopId, slug]);

  const onAdd = async () => {
    const ids = newIds.split(',').map(s=>s.trim()).filter(Boolean);
    await addProducts(album._id, ids, token);
    setNewIds('');
    await load();
  };

  const onReorder = async () => {
    const ordered = album.items.map(i=>i.product._id); // ở đây demo giữ nguyên
    await reorder(album._id, ordered, token);
    await load();
  };

  if (!album) return null;
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{album.name}</h1>
      <p className="text-gray-600">{album.theme}</p>

      <div className="mt-4 flex gap-2">
        <input value={newIds} onChange={e=>setNewIds(e.target.value)}
               placeholder="Nhập productIds, phân tách bằng dấu phẩy"
               className="rounded-md px-3 py-2 border flex-1" />
        <button className="px-4 py-2 rounded-md border" onClick={onAdd}>Thêm sản phẩm</button>
      </div>

      <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {album.items.map(i=>(
          <li key={i.product._id} className="border rounded-md p-2">
            <img src={i.product.image} alt="" className="w-full h-28 object-cover rounded" />
            <div className="text-sm mt-2 line-clamp-1">{i.product.name}</div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button className="px-4 py-2 rounded-md border" onClick={onReorder}>Lưu thứ tự</button>
      </div>
    </div>
  );
}
