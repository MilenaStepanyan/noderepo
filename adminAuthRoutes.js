import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import { addAdmin, findAdminByUsername, comparePassword } from './adminStore.js';

const router = express.Router();

addAdmin('admin', 'admin123');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = findAdminByUsername(username);

    if (!admin || !comparePassword(password, admin.password)) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: admin.id,
        role: 'admin',
      },
    };

    jwt.sign(payload, JWT_SECRET || 'secretKeyAit', { expiresIn: '10h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;