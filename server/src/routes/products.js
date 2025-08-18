import express from 'express';
import multer from 'multer';
import Product from '../models/products.js'; 
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';

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

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      details,
      price,
      quantity,
      category, 
      isFeatured
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      name,
      description,
      details,
      price,
      quantity,
      category,
      isFeatured: isFeatured === 'true',
      image: imageUrl,
      slug: slugify(name, { lower: true, strict: true }),
    });

    await newProduct.save();

    const populatedProduct = await newProduct.populate('category', 'name slug');

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm' });
  }
});


router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
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
