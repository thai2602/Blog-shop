import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useToast } from "../components/ToastProvider";

export default function CreateShop() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    images: [],
    description: "",
    contact: {
      phone: "",
      email: "",
      facebook: "",
      address: "",
    },
  });

  // chặn vào trang nếu chưa đăng nhập
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) navigate("/login");
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    // contact.*
    if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageInput("");
  };

  const removeImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      addToast("Tên shop là bắt buộc", "error");
      return false;
    }
    if (form.contact.email && !/^\S+@\S+\.\S+$/.test(form.contact.email)) {
      addToast("Email không hợp lệ", "error");
      return false;
    }
    return true;
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) {
        addToast("Bạn cần đăng nhập trước", "error");
        navigate("/login");
        return;
    }

    setLoading(true);
    try {
        const payload = {
        name: form.name.trim(),
        avatar: form.avatar.trim(),
        images: (form.images || []).map(s => s.trim()).filter(Boolean),
        description: form.description.trim(),
        contact: {
            phone: form.contact.phone.trim(),
            email: form.contact.email.trim(),
            facebook: form.contact.facebook.trim(),
            address: form.contact.address.trim(),
        },
        };

        const res = await api.post("/shop", payload, {
        headers: { Authorization: `Bearer ${token}` },
        });

        addToast("Tạo shop thành công!", "success");
        const created = res.data; // backend trả về object shop
        navigate(`/shop/${created._id}`);
        return;
    } catch (err) {
        // Nếu backend chặn 1 user = 1 shop
        if (err.response?.status === 409) {
        const shopId = err.response.data?.shopId;
        if (shopId) {
            addToast("Bạn đã có shop, chuyển sang trang shop.", "info");
            navigate(`/shop/${shopId}`);
            return;
        }
        // Fallback: tự lấy shop của mình (NHỚ gắn Authorization)
        try {
            const me = await api.get("/shop/me", {
            headers: { Authorization: `Bearer ${token}` },
            });
            navigate(`/shop/${me.data._id}`);
            return;
        } catch (e2) {
            const msg = e2.response?.data?.message || "Không thể lấy shop hiện có";
            addToast(msg, "error");
        }
        } else {
        const msg = err.response?.data?.message || "Không thể tạo shop";
        addToast(msg, "error");
        }
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Tạo Shop</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên shop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên shop *</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="VD: Huy Store"
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          {/* Avatar URL + preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar (URL)</label>
            <div className="flex gap-3 items-center">
              <input
                name="avatar"
                value={form.avatar}
                onChange={onChange}
                placeholder="https://..."
                className="flex-1 border rounded-md p-2"
              />
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : null}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Bạn có thể điền URL ảnh. Nếu muốn upload file, hãy tạo endpoint upload và đổi sang FormData.
            </p>
          </div>

          {/* Images list */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Album ảnh (URL)</label>
            <div className="flex gap-2">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 border rounded-md p-2"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {form.images.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt={`img-${idx}`}
                      className="w-full h-28 object-cover rounded border"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 px-2 py-1 text-xs bg-red-500 text-white rounded"
                    >
                      Xoá
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Giới thiệu ngắn về shop..."
              className="w-full border rounded-md p-2"
              rows={4}
            />
          </div>

          {/* Contact */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                name="contact.phone"
                value={form.contact.phone}
                onChange={onChange}
                placeholder="090..."
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="contact.email"
                value={form.contact.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="w-full border rounded-md p-2"
                type="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                name="contact.facebook"
                value={form.contact.facebook}
                onChange={onChange}
                placeholder="https://facebook.com/yourpage"
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input
                name="contact.address"
                value={form.contact.address}
                onChange={onChange}
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Đang tạo..." : "Tạo shop"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
