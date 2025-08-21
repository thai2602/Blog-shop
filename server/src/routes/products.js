// routes/products.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import slugify from 'slugify';
import mongoose from 'mongoose';
import Product from '../models/products.js';
import ensureShopOwner from '../utils/ensureShopOwner.js';
import { isAuth } from '../middlewares/auth.js';

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

/**
 * POST /products/shop/:shopId
 * Tạo sản phẩm thuộc 1 shop cụ thể (yêu cầu đăng nhập + chủ shop)
 */
router.post('/shop/:shopId', isAuth, upload.single('image'), async (req, res) => {
  try {
    const { shopId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: 'Invalid shopId' });
    }

    // Xác thực chủ shop
    await ensureShopOwner(shopId, req.user._id);

    const {
      name,
      description,
      details,
      price,
      quantity,
      category,
      isFeatured,
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      shopId,                                  // <-- GẮN shopId vào document
      name,
      description,
      details,
      price: Number(price),
      quantity: Number(quantity),
      category,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      image: imageUrl,
      slug: slugify(name, { lower: true, strict: true }),
    });

    await newProduct.save();
    const populatedProduct = await newProduct.populate('category', 'name slug');

    res.status(201).json(populatedProduct);
  } catch (error) {
    // Xử lý trùng slug trong cùng shop (index {shopId, slug} unique)
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Sản phẩm (slug) đã tồn tại trong shop này' });
    }
    if (['FORBIDDEN','SHOP_NOT_FOUND'].includes(error?.message)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm' });
  }
});

/**
 * GET /products/shop/:shopId
 * Lấy danh sách sản phẩm theo shop
 */
router.get('/shop/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: 'Invalid shopId' });
    }
    const products = await Product.find({ shopId })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm theo shop:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
  }
});

/* ====== Các route cũ vẫn giữ nếu bạn cần ====== */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      shopId,               // cho phép pass shopId qua body nếu vẫn dùng endpoint này
      name,
      description,
      details,
      price,
      quantity,
      category,
      isFeatured
    } = req.body;

    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: 'shopId is required/invalid' });
    }

    // Nếu muốn bảo vệ endpoint này thì bật:
    // await ensureShopOwner(shopId, req.user._id);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      shopId,                                  // <-- thêm shopId
      name,
      description,
      details,
      price: Number(price),
      quantity: Number(quantity),
      category,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      image: imageUrl,
      slug: slugify(name, { lower: true, strict: true }),
    });

    await newProduct.save();
    const populatedProduct = await newProduct.populate('category', 'name slug');
    res.status(201).json(populatedProduct);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Sản phẩm (slug) đã tồn tại trong shop này' });
    }
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { shopId } = req.query;
    const filter = {};
    if (shopId) {
      if (!mongoose.Types.ObjectId.isValid(shopId)) {
        return res.status(400).json({ message: 'Invalid shopId' });
      }
      filter.shopId = shopId;
    }
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo slug:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
