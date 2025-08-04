// server/routes/posts.js
import express from 'express';
import multer from 'multer';
import Post from '../models/posts.js';
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';

// Xác định __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads'); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
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

// GET /posts/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    res.json(post);
  } catch (error) {
    console.error('Lỗi khi lấy bài viết theo slug:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
