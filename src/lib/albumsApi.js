const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function createAlbum(shopId, payload, token) {
  const res = await fetch(`${BASE}/api/albums/${shopId}`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listAlbums(shopId, { page=1, limit=12, q='' } = {}) {
  const url = new URL(`${BASE}/api/albums/${shopId}`);
  if (page) url.searchParams.set('page', page);
  if (limit) url.searchParams.set('limit', limit);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAlbum(shopId, slug) {
  const res = await fetch(`${BASE}/api/albums/${shopId}/${slug}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addProducts(albumId, productIds, token) {
  const res = await fetch(`${BASE}/api/albums/${albumId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ productIds }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function reorder(albumId, orderedProductIds, token) {
  const res = await fetch(`${BASE}/api/albums/${albumId}/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ orderedProductIds }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
