import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Article ({ description }) {

    
    
    return (
    <section className="rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Our Story</h2>
            <div className="flex gap-2">
            {/* Nút chỉnh sửa */}
            <button
                onClick={() => setEditing(true)} // ví dụ bật state modal
                className="rounded-lg bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
            >
                Chỉnh sửa
            </button>

            {/* Nút link tới blog */}
            <Link
                to={`/blog/our-story`} // thay bằng slug/id blog thật
                className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
                Xem chi tiết
            </Link>
            </div>
        </div>

        <p className="leading-relaxed text-gray-600">
            {shop.description || "Chưa có mô tả."}
        </p>
    </section>
    )

}