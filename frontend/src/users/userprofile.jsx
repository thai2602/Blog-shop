import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { API_URL } from "../config"; 

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!ignore) setUser(res.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [navigate]);

  if (loading) return <div className="p-6">Loading...</div>;

  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith('/uploads/')
        ? `${API_URL}${user.avatar}`
        : user.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <ul className="space-y-2">
          <li className="p-2 bg-blue-100 rounded">Profile</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Account</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Chat</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Voice & video</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Appearance</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Notification</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 bg-white shadow">
        <div className="max-w-2xl">
          <div className="flex items-center gap-6 mb-6">
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-20 h-20 rounded-full border"
            />
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Change picture
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete picture
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile name</label>
              <input
                type="text"
                defaultValue={user?.username || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                defaultValue={user?.username || ""}
                disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Available change in 25/04/2024</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status recently</label>
              <input
                type="text"
                defaultValue={user?.status || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">About me</label>
              <textarea
                defaultValue={user?.about || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
