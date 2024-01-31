import express from "express";
import pool from "./db.js";
import { authMiddleware } from "./authMiddleware.js";
import { userAuthMiddleware } from "./userAuthMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { name, minPrice, maxPrice, category, sort, page, limit } = req.query;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    sort = sort || "product_id"; 

    let filterConditions = [];
    let params = [];

    if (name) {
      filterConditions.push("name LIKE ?");
      params.push(`%${name}%`);
    }

    if (minPrice) {
      filterConditions.push("price >= ?");
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      filterConditions.push("price <= ?");
      params.push(parseFloat(maxPrice));
    }

    if (category) {
      filterConditions.push("category = ?");
      params.push(category);
    }

    const filterQuery = filterConditions.length > 0 ? `WHERE ${filterConditions.join(" AND ")}` : "";

    const offset = (page - 1) * limit;
    const paginationQuery = `LIMIT ${limit} OFFSET ${offset}`;

    const query = `SELECT * FROM products ${filterQuery} ORDER BY ${sort} ${paginationQuery}`;

    const [rows] = await pool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});
  router.post("/order",async (req, res) => {
    try {
        const { products } = req.body;
    
        if (!Array.isArray(products) || products.length === 0) {
          return res.status(400).json({ msg: 'Invalid order format' });
        }
    
        for (const { productId, quantity } of products) {
          const [productRows] = await pool.query('SELECT * FROM products WHERE product_id = ? AND quantity >= ?', [productId, quantity]);
    
          if (productRows.length === 0) {
            console.log(`Product not found or insufficient quantity for product ${productId}`);
            return res.status(404).json({ msg: `Product not found or insufficient quantity for product ${productId}` });
          }
    

          await pool.query('UPDATE products SET quantity = quantity - ? WHERE product_id = ?', [quantity, productId]);
    
          console.log(`Order placed for product ${productId} (Quantity: ${quantity})`);
        }
    
        res.status(200).json({ msg: 'Order placed successfully' });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});
router.get('/:productId/reviews', async (req, res) => {
    try {
      const productId = req.params.productId;
      const [reviews] = await pool.query('SELECT * FROM reviews WHERE product_id = ?', [productId]);
      res.json(reviews);
    } catch (error) {
      console.error('Error getting reviews:', error);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  

  router.post('/:productId/reviews', async (req, res) => {
    try {
      const productId = req.params.productId;
      const { content } = req.body;
  
      await pool.query('INSERT INTO reviews (product_id, content) VALUES (?, ?)', [productId, content]);
      
      res.status(201).json({ msg: 'Review added successfully' });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  
  router.delete('/:productId/reviews/:reviewId', userAuthMiddleware, async (req, res) => {
    try {
    
      const reviewId = req.params.reviewId;
      const productId = req.params.productId;
  
      console.log('Deleting review.', 'Product ID:', productId, 'Review ID:', reviewId);
  
      const [result] = await pool.query('DELETE FROM reviews WHERE review_id = ? AND product_id = ?', [reviewId, productId]);
  
      console.log('Delete query result:', result);
  
      if (result.affectedRows > 0) {
        res.json({ msg: 'Review deleted successfully' });
      } else {
        res.status(404).json({ msg: 'Review not found or you do not have permission to delete' });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  router.post('/:productId/rate', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { rating } = req.body;

        await pool.query(
            'UPDATE products SET rating = LEAST((rating * ratings_count + ?) / (ratings_count + 1), 5), ratings_count = ratings_count + 1 WHERE product_id = ?',
            [rating, productId]
        );

        res.status(201).json({ msg: 'Product rated successfully' });
    } catch (error) {
        console.error('Error rating product:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

  
  
  

export default router;
