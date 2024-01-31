//productRoutes
import express from "express";
import { authMiddleware } from "./authMiddleware.js";
import { isAdmin } from "./adminMiddleware.js";
import pool from "./db.js";
import multer from 'multer';
import path from 'path';
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
router.post("/", authMiddleware, isAdmin,upload.single('picture'), async (req, res) => {
  const { name, description, price, quantity, category, rating } =
    req.body;
    const picture = req.file ? req.file.filename : null;
  if (!name || !description || !price) {
    return res
      .status(400)
      .json({ msg: "Please provide name, description,price .etc" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price,picture,quantity,category,rating) VALUES (?, ?, ?,?,?,?,?)",
      [name, description, price, picture, quantity, category, rating]
    );

    const newProductId = result[0].insertId;

    const newProduct = {
      id: newProductId,
      name,
      description,
      price,
      picture,
      quantity,
      category,
      rating: rating,
    };

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE product_id = ?",
      [productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, description, price, picture, quantity, category, rating } =
    req.body;

  try {
    const result = await pool.query(
      "UPDATE products SET name = ?, picture = ?, quantity = ?, category = ?, rating = ?, description = ?, price = ? WHERE product_id = ?",
      [name, picture, quantity, category, rating, description, price, productId]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const updatedProduct = {
      id: productId,
      name: name,
      description: description,
      price: price,
      picture: picture,
      quantity: quantity,
      category: category,
      rating: 0,
    };

    res.json({ msg: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});
router.get("/:productId/reviews", authMiddleware, async (req, res) => {
  const productId = req.params.productId;

  try {
    const [reviews] = await pool.query(
      "SELECT * FROM reviews WHERE product_id = ?",
      [productId]
    );

    res.json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});


router.delete(
  "/:productId/reviews/:reviewId",
  authMiddleware,
  async (req, res) => {
    const productId = req.params.productId;
    const reviewId = req.params.reviewId;

    try {
      await pool.query(
        "DELETE FROM reviews WHERE review_id = ? AND product_id = ?",
        [reviewId, productId]
      );

      res.json({ msg: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);
router.post("/:productId/ratings", authMiddleware, async (req, res) => {
  const productId = req.params.productId;
  const { rating } = req.body;

  try {
    await pool.query(
      "UPDATE products SET rating = LEAST((rating * ratings_count + ?) / (ratings_count + 1), 5), ratings_count = ratings_count + 1 WHERE product_id = ?",
      [rating, productId]
    );

    res.status(201).json({ msg: "Product rated successfully" });
  } catch (error) {
    console.error("Error rating product:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});



router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM products WHERE product_id = ?",
      [productId]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({
      msg: "Product deleted successfully",
      product: { id: productId },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});



export default router;
