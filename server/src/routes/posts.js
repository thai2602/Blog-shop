// server/routes/posts.js
import express from 'express';
import multer from 'multer';
import Post from '../models/posts.js';
import slugify from 'slugify';

const router = express.Router();

// Cấu hình nơi lưu trữ ảnh (tạm lưu trong local)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// POST /posts
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newPost = new Post({
      title,
      summary,
      content,
      image: imageUrl,
      slug: slugify(title, { lower: true, strict: true }),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo bài viết' });
  }
});

// GET /posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết' });
  }
});


export default router;
