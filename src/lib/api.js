import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // nếu dùng cookie
});

// Bypass ngrok interstitial
api.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

export default api;