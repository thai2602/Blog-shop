export default function toAbsUrl(url) {
  if (!url) return "";
  try {
    const u = String(url).trim();
    if (u.startsWith("/uploads/")) return `${API_URL}${u}`;
    if (!/^https?:\/\//i.test(u)) return ""; 
    return new URL(u).href;
  } catch {
    return "";
  }
}