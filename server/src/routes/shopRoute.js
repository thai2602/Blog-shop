import express from "express";
import mongoose from "mongoose";
import Shop from "../models/shop.js";
import Product from "../models/products.js";
import { isAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

/* ----------------------- helpers ----------------------- */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// middleware: only shop owner or admin can update/delete
async function ownerOrAdmin(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid shop id" });
    const shop = await Shop.findById(id).select("userId");
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const isOwner = String(shop.userId) === String(req.user._id);
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    req.shop = shop; // attach for later handlers if needed
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}

/* ----------------------- GET list ----------------------- */
/**
 * GET /shops?q=keyword&userId=...&page=1&limit=12
 */
router.get("/", async (req, res) => {
  try {
    const { q, userId, page = 1, limit = 12 } = req.query;

    const filters = {};
    if (q) filters.name = { $regex: q.trim(), $options: "i" };
    if (userId && isValidId(userId)) filters.userId = userId;

    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));

    const [items, total] = await Promise.all([
      Shop.find(filters)
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .select("name avatar description contact userId")
        .populate("userId", "username email role")
        .select("_id name slug avatar description contact userId"),
      Shop.countDocuments(filters),
    ]);

    res.json({ items, total, page: p, pages: Math.ceil(total / l) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- GET detail ----------------------- */
/**
 * GET /shop/id/:id
 */
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid shop id" });

    const shop = await Shop.findById(id)
      .populate("userId", "username email role")
      .populate("products", "name price images isFeatured")
      .populate("albums.products", "name price images isFeatured");

    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- GET my shop ----------------------- */
/**
 * GET /shop/me
 */
router.get("/me", isAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.user._id })
      .populate("products", "name price images isFeatured slug")
      .populate("albums.products", "name price images slug")
      .lean();

    if (!shop) return res.status(404).json({ message: "You have not created a shop yet" });
    res.json(shop);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- CREATE ----------------------- */
/**
 * POST /shop
 */
router.post("/", isAuth, async (req, res) => {
  try {
    const { name, avatar, images, description, contact } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ message: "Shop name is required" });

    const exists = await Shop.findOne({ userId: req.user._id }).select("_id");
    if (exists) {
      return res.status(409).json({
        message: "You already have a shop",
        shopId: exists._id,
      });
    }

    const shop = await Shop.create({
      userId: req.user._id,
      name: name.trim(),
      avatar,
      images: Array.isArray(images) ? images : [],
      description,
      contact,
      products: [],
      albums: [],
    });

    res.status(201).json(shop);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- UPDATE ----------------------- */
router.patch("/id/:id", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {};
    const { name, avatar, images, description, contact } = req.body || {};

    if (name !== undefined) payload.name = String(name).trim();
    if (avatar !== undefined) payload.avatar = avatar;
    if (images !== undefined) payload.images = Array.isArray(images) ? images : [];
    if (description !== undefined) payload.description = description;
    if (contact !== undefined) payload.contact = contact;

    const updated = await Shop.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: "Shop not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- DELETE ----------------------- */
router.delete("/id/:id", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Shop.findByIdAndDelete(id);
    res.json({ message: "Shop deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- PRODUCTS IN SHOP ----------------------- */
router.post("/id/:id/products", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { productIds } = req.body || {};
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "productIds are required" });
    }

    const validIds = productIds.filter(isValidId);
    if (!validIds.length) return res.status(400).json({ message: "Invalid productIds" });

    const updated = await Shop.findByIdAndUpdate(
      id,
      { $addToSet: { products: { $each: validIds } } },
      { new: true }
    ).populate("products", "name price images");
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/id/:id/products/:productId", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id, productId } = req.params;
    if (!isValidId(productId)) return res.status(400).json({ message: "Invalid productId" });

    const updated = await Shop.findByIdAndUpdate(
      id,
      { $pull: { products: productId } },
      { new: true }
    ).populate("products", "name price images");
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- ALBUMS ----------------------- */
router.post("/id/:id/albums", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ message: "Album name is required" });

    const updated = await Shop.findByIdAndUpdate(
      id,
      { $push: { albums: { name: name.trim(), products: [] } } },
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/id/:id/albums/:albumId", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id, albumId } = req.params;
    const { name } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ message: "Album name is required" });

    const updated = await Shop.findOneAndUpdate(
      { _id: id, "albums._id": albumId },
      { $set: { "albums.$.name": name.trim() } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Album not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/id/:id/albums/:albumId", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id, albumId } = req.params;
    const updated = await Shop.findByIdAndUpdate(
      id,
      { $pull: { albums: { _id: albumId } } },
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/id/:id/albums/:albumId/products", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id, albumId } = req.params;
    const { productIds } = req.body || {};
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "productIds are required" });
    }
    const validIds = productIds.filter(isValidId);
    if (!validIds.length) return res.status(400).json({ message: "Invalid productIds" });

    const updated = await Shop.findOneAndUpdate(
      { _id: id, "albums._id": albumId },
      { $addToSet: { "albums.$.products": { $each: validIds } } },
      { new: true }
    ).populate("albums.products", "name price images");
    if (!updated) return res.status(404).json({ message: "Album not found" });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/id/:id/albums/:albumId/products/:productId", isAuth, ownerOrAdmin, async (req, res) => {
  try {
    const { id, albumId, productId } = req.params;
    if (!isValidId(productId)) return res.status(400).json({ message: "Invalid productId" });

    const updated = await Shop.findOneAndUpdate(
      { _id: id, "albums._id": albumId },
      { $pull: { "albums.$.products": productId } },
      { new: true }
    ).populate("albums.products", "name price images");
    if (!updated) return res.status(404).json({ message: "Album not found" });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
