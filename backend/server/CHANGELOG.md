# Changelog - Image Upload Fix

## [2024-01-XX] - Image Upload với Ngrok

### 🎯 Vấn đề đã fix

Trước đây khi frontend chạy qua ngrok, images không load được vì backend trả về relative path `/uploads/image.jpg`. Browser không biết lấy từ đâu.

### ✨ Giải pháp

Backend giờ trả về **full URL** thay vì relative path:
- Trước: `/uploads/image.jpg`
- Sau: `http://localhost:5000/uploads/image.jpg`

### 📝 Files đã thay đổi

#### Mới tạo:
- `src/utils/fileHelper.js` - Helper function để generate full URL
- `.env.example` - Template cho environment variables
- `IMAGE_UPLOAD_GUIDE.md` - Hướng dẫn chi tiết
- `QUICK_START.md` - Quick reference

#### Đã update:
- `src/routes/posts.js` - Dùng `getFileUrl()` thay vì hardcode path
- `src/routes/products.js` - Dùng `getFileUrl()` thay vì hardcode path
- `src/controllers/post.controller.js` - Dùng `getFileUrl()` (refactored version)
- `.env` - Thêm `API_BASE_URL`

### 🚀 Cách sử dụng

#### 1. Update .env
```env
API_BASE_URL=http://localhost:5000
```

#### 2. Restart backend
```bash
cd backend/server
npm start
```

#### 3. Test upload
Upload một image và check response có full URL chưa.

### 📚 Documentation

- **Quick Start**: Đọc `QUICK_START.md` để biết cách dùng
- **Chi tiết**: Đọc `IMAGE_UPLOAD_GUIDE.md` để hiểu rõ hơn

### 🔧 Breaking Changes

**KHÔNG CÓ** - Backward compatible!

Nếu không set `API_BASE_URL`, sẽ fallback về `http://localhost:5000`.

### 💡 Best Practices

1. **Development**: Không cần ngrok, chạy local
2. **Demo**: Chỉ ngrok frontend nếu cần
3. **Share**: Ngrok cả 2 và update `API_BASE_URL`

### 🐛 Known Issues

Không có.

### 📦 Dependencies

Không thêm dependency mới.

### 🎓 Migration Guide

Không cần migrate! Code cũ vẫn hoạt động.

Nếu muốn dùng tính năng mới:
1. Thêm `API_BASE_URL` vào `.env`
2. Restart backend
3. Done!
