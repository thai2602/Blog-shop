import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,    
  // withCredentials: false // không cần cookie nếu dùng Bearer
});

api.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = "true";
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;  // <— QUAN TRỌNG
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
