import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';
import connectDB from './db.js'; 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/posts', postsRouter);

//  Gọi kết nối DB và chạy server
connectDB().then(() => {
  app.listen(5000, () => console.log('🚀 Server listening at http://localhost:5000'));
});
