// server/routes/posts.js
import mongoose from 'mongoose';
import express from 'express';
import multer from 'multer';
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';

import Post from '../models/posts.js';
import { isAuth } from '../middlewares/auth.js'



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
router.post('/', isAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content, categories } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    let categoryArray = [];
    if (categories) {
      categoryArray = (Array.isArray(categories) ? categories : JSON.parse(categories))
      .map(id => new mongoose.Types.ObjectId(id));
    }

    const newPost = new Post({
      userId: req.user._id,
      title,
      summary,
      content,
      image: imageUrl,
      categories: categoryArray, 
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
    const { category } = req.query;
    let filter = {};

    if (category) {
      filter.categories = category; 
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "username email")
      .populate({
        path: 'categories',
        select: 'name slug', 
      });

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
    const post = await Post.findOne({ slug })
      .populate("userId", "username email")
      .populate({
        path: 'categories',
        select: 'name slug'
      });

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    res.json(post);
  } catch (error) {
    console.error('Lỗi khi lấy bài viết theo slug:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /posts/me  -> các bài viết của user hiện tại
router.get('/me', isAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // --- optional: phân trang + lọc ---
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const { category, search } = req.query;

    const filter = { userId };

    if (category) {
      // category là _id category
      filter.categories = category;
    }

    if (search) {
      // tìm theo tiêu đề/tóm tắt (không phân biệt hoa thường)
      const rx = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: rx }, { summary: rx }];
    }

    const [items, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username email')
        .populate({ path: 'categories', select: 'name slug' }),
      Post.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items,
    });
  } catch (error) {
    console.error('Lỗi khi lấy posts của tôi:', error);
    res.status(500).json({ message: 'Lỗi khi lấy bài viết của bạn' });
  }
});


export default router;
