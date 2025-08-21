import express from "express";
import {
  createAlbum,
  listAlbums,
  getAlbumBySlug,
  getAlbumById,
  updateAlbumMeta,
  addProducts,
  reorderItems,
  removeProduct,
  deleteAlbum,
} from "../controllers/album.controller.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

/**
 * PUBLIC
 * - GET /api/albums                   -> list tất cả hoặc filter bằng ?shopId=...
 * - GET /api/albums/shop/:shopId     -> list theo shop
 * - GET /api/albums/shop/:shopId/:slug -> lấy album theo slug trong 1 shop
 */
router.get("/", listAlbums);
router.get("/shop/:shopId/:slug", getAlbumBySlug);
router.get("/shop/:shopId", listAlbums);
router.get("/:albumId", getAlbumById);

/**
 * PRIVATE (cần chủ shop đăng nhập)
 * - POST   /api/albums/shop/:shopId         -> tạo album
 * - PATCH  /api/albums/:albumId             -> cập nhật metadata album
 * - POST   /api/albums/:albumId/items       -> thêm sản phẩm vào album
 * - POST   /api/albums/:albumId/reorder     -> reorder items
 * - DELETE /api/albums/:albumId/items/:productId -> xoá 1 sản phẩm khỏi album
 * - DELETE /api/albums/:albumId             -> xoá album
 */
router.post("/shop/:shopId", isAuth, createAlbum);
router.patch("/:albumId", isAuth, updateAlbumMeta);
router.post("/:albumId/items", isAuth, addProducts);
router.post("/:albumId/reorder", isAuth, reorderItems);
router.delete("/:albumId/items/:productId", isAuth, removeProduct);
router.delete("/:albumId", isAuth, deleteAlbum);

export default router;
