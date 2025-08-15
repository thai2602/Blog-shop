import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';
import productsRouter from './routes/products.js';
import userRoutes from './routes/users.js';
import postCategories from './routes/postCategoriesRoute.js'
import ProductCategoriesRoute from './routes/productCategoriesRoute.js';
import connectDB from './db.js'; 
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());


const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));


app.use('/posts', postsRouter);
app.use('/products', productsRouter);
app.use('/users', userRoutes);
app.use('/categories', postCategories);
app.use('/productCategories', ProductCategoriesRoute);

const frontendPath = path.join(__dirname, 'dist'); // dist của frontend build
app.use(express.static(frontendPath));


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 🚀 Start server
connectDB().then(() => {
  app.listen(5000, () => console.log('🚀 Server listening at http://localhost:5000'));
});

console.log('👉 Upload path:', uploadDir);
