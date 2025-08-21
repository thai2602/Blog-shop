import express from 'express';
import bcrypt from 'bcryptjs';              
import jwt from 'jsonwebtoken';            
import User from '../models/Users.js';
import { isAuth } from '../middlewares/auth.js';   

const router = express.Router();

const requireJWT = () => {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error('Missing JWT_SECRET in .env');
  }
  return key;
};

router.post('/register', async (req, res) => {
  console.log('Body nhận từ FE:', req.body);
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Thiếu username, email hoặc password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải >= 6 ký tự' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username đã được sử dụng' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      return res.status(409).json({ message: `${field} đã được sử dụng` });
    }
    console.error('Lỗi khi đăng ký:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/login', async (req, res) => {
  console.log('Body nhận từ FE:', req.body);
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu email hoặc password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, username: user.username },
      requireJWT(),
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    return res.json({ message: 'Đăng nhập thành công', token });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

router.get('/profile', isAuth, async (req, res) => {
  try {
    // Hỗ trợ cả trường hợp req.user là decoded ({id}) hoặc là doc ({_id})
    const uid = req.user?._id || req.user?.id;
    if (!uid) return res.status(401).json({ message: 'Not authenticated' });

    const user = await User.findById(uid).select('-password');
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });
    return res.json(user);
  } catch (error) {
    console.error('Lỗi khi lấy profile:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
