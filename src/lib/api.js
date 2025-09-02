import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,    

});

api.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = "true";
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;  
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default api;
