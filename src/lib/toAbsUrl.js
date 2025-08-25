import { API_URL } from "../config";

export default function toAbsUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // nối an toàn: tránh //uploads
  const base = API_URL?.replace(/\/+$/, "") || "";
  const path = String(url).startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}
