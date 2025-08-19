import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./db.js";
import User from "./models/users.js";

import postsRouter from "./routes/posts.js";
import productsRouter from "./routes/products.js";
import userRoutes from "./routes/users.js";
import postCategories from "./routes/postCategoriesRoute.js";
import ProductCategoriesRoute from "./routes/productCategoriesRoute.js";
import albumRoutes from "./routes/albumsRoute.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const ENV_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  /\.ngrok-free\.app$/
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    )) return cb(null, true);
    cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","ngrok-skip-browser-warning"],
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

export const isAuth = async (req, res, next) => {
  try {
    let token;
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) token = auth.split(" ")[1];
    if (!token && req.cookies?.token) token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } else if (req.cookies?.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch {}
  next();
};

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

app.get("/health", (_req, res) => res.send("ok"));

app.use("/posts", postsRouter);
app.use("/products", productsRouter);
app.use("/users", userRoutes);
app.use("/categories", postCategories);
app.use("/productCategories", ProductCategoriesRoute);
app.use("/api/albums", albumRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
    console.log("CORS extra ENV origins:", ENV_ORIGINS);
  });
});
