import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';
import connectDB from './db.js'; 
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

app.use('/posts', postsRouter);

//  Gọi kết nối DB và chạy server
connectDB().then(() => {
  app.listen(5000, () => console.log('🚀 Server listening at http://localhost:5000'));
});

console.log('👉 Upload path:', uploadDir);
