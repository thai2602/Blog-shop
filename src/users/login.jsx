import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useToast } from '../components/ToastProvider'

export default function Login() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/users/login', form);
            localStorage.setItem('token', res.data.token);
            addToast("Đăng nhập thành công!", "success");
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || "Có lỗi xảy ra khi đăng nhập";
            addToast(msg, "error");
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
