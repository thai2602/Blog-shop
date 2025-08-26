import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useToast } from "../components/ToastProvider";

export default function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ username:"", email:"", password:"", confirmPassword:"" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      return addToast("Please fill in all information", "error");
    }
    if (form.password.length < 6) {
      return addToast("Password must be >= 6 characters", "error");
    }
    if (form.password !== form.confirmPassword) {
      return addToast("Confirm password does not match", "error");
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      };
      await api.post("/users/register", payload);
      addToast("Registration successful! Please login.", "success");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input name="username" placeholder="Username"
          value={form.username} onChange={handleChange}
          className="w-full p-2 mb-3 border rounded" required />

        <input type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange}
          className="w-full p-2 mb-3 border rounded" required />

        <input type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange}
          className="w-full p-2 mb-3 border rounded" required />

        <input type="password" name="confirmPassword" placeholder="Confirm Password"
          value={form.confirmPassword} onChange={handleChange}
          className="w-full p-2 mb-4 border rounded" required />

        <button type="submit" disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-2 rounded">
          {loading ? "Processing..." : "Register"}
        </button>
      </form>
    </div>
  );
}
