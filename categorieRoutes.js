// //categorieRoutes
// import express from 'express';
// import { authMiddleware } from './authMiddleware.js';
// import pool from './db.js';

// const router = express.Router();

// router.post('/', authMiddleware, async (req, res) => {
//   console.log('Received POST request to /categories');
//   const { name } = req.body;

//   if (!name) {
//     return res.status(400).json({ msg: 'Please provide a category name' });
//   }

//   try {
//     const result = await pool.query(
//       'INSERT INTO categories (name) VALUES (?)',
//       [name]
//     );

//     const newCategoryId = result[0].insertId;

//     const newCategory = {
//       category_id: newCategoryId,
//       name,
//     };

//     res.status(201).json(newCategory);
//   } catch (error) {
//     console.error('Error adding category:', error);
//     res.status(500).json({ msg: 'Server Error', error: error.message });
//   }
// });




// router.get('/', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM categories');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error getting categories:', error);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// router.get("/:id", async (req, res) => {
//   const categoryId = parseInt(req.params.id);

//   try {
//     const [rows] = await pool.query('SELECT * FROM categories WHERE category_id = ?', [categoryId]);


//     if (rows.length === 0) {
//       return res.status(404).json({ msg: "Category not found" });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error('Error getting category:', error);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });


// router.put("/:id", authMiddleware, async (req, res) => {
//   const categoryId = parseInt(req.params.id);
//   const { name } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE categories SET name = ? WHERE category_id = ?',
//       [name, categoryId]
//     );

//     if (result[0].affectedRows === 0) {
//       return res.status(404).json({ msg: "Category not found" });
//     }

//     const updatedCategory = {
//       id: categoryId,
//       name,
//     };

//     res.json({ msg: "Category updated successfully", category: updatedCategory });
//   } catch (error) {
//     console.error('Error updating category:', error);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// router.delete("/:id", authMiddleware, async (req, res) => {
//   const categoryId = parseInt(req.params.id);

//   try {
//     const result = await pool.query('DELETE FROM categories WHERE category_id = ?', [categoryId]);

//     if (result[0].affectedRows === 0) {
//       return res.status(404).json({ msg: "Category not found" });
//     }

//     res.json({ msg: "Category deleted successfully", category: { id: categoryId } });
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

//  export default router;
