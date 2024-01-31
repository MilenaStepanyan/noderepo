//index.js
import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './productRoutes.js';
import adminAuthRoutes from './adminAuthRoutes.js';
import userProductRoutes from './userProductRoutes.js'
import userRoutes from './userRouter.js';
// import categorieRoutes from "./categorieRoutes.js";
import cors from 'cors';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '10mb' }));




app.use('/admin', adminAuthRoutes);
app.use('/admin/products', productRoutes);
app.use('/user/products', userProductRoutes);
// app.use('/categories', categorieRoutes);
app.use('/users', userRoutes);

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
