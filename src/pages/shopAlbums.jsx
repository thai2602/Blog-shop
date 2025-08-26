import { useEffect, useState } from 'react';
import { listAlbums, createAlbum } from "../lib/albumsApi.js";

export default function ShopAlbums({ shopId, token }) {
  const [albums, setAlbums] = useState([]);
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');

  const load = async () => {
    const data = await listAlbums(shopId, { q });
    setAlbums(data.items);
  };
  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    await createAlbum(shopId, { name, theme }, token);
    setName(''); setTheme('');
    await load();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>

      <form onSubmit={onCreate} className="flex gap-2 mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tên album"
               className="input input-bordered flex-1 rounded-md px-3 py-2 border" />
        <input value={theme} onChange={e=>setTheme(e.target.value)} placeholder="Chủ đề (optional)"
               className="input input-bordered flex-1 rounded-md px-3 py-2 border" />
        <button className="px-4 py-2 rounded-md border">Tạo</button>
      </form>

      <div className="mb-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm album…"
               className="rounded-md px-3 py-2 border w-full"
               onKeyDown={e=>e.key==='Enter' && load()} />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {albums.map(a=>(
          <li key={a.slug} className="border rounded-lg p-3">
            <div className="font-semibold">{a.name}</div>
            <div className="text-sm text-gray-500">{a.theme}</div>
            <div className="text-xs mt-1">{a.productCount} products</div>
            {/* Link to product detail */}
          </li>
        ))}
      </ul>
    </div>
  );
}
