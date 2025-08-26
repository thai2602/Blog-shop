import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { useToast } from "../components/ToastProvider";
import { fetchAndSaveShop } from "../lib/shop";

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const payload = { email: form.email.trim(), password: form.password };
      const res = await api.post("/users/login", payload);
      const token = res.data?.token;
      if (!token) throw new Error("Did not receive tokens");
      localStorage.setItem("token", token);

      await fetchAndSaveShop();

      addToast("Login successful!", "success");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred while logging in.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input type="email" name="email" placeholder="Email" value={form.email}
          onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />

        <input type="password" name="password" placeholder="Password" value={form.password}
          onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />

        <button type="submit" disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-2 rounded">
          {loading ? "Processing..." : "Login"}
        </button>

        <Link to="/register" className="flex w-full justify-center items-center p-4">
          Register
        </Link>
      </form>
    </div>
  );
}
