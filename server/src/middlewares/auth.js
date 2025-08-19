// server/src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/users.js';

export const isAuth = async (req, res, next) => {
  try {
    let token;
    const auth = req.headers.authorization;

    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
