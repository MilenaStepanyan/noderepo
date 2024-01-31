// adminMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

export const isAdmin = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'secretKeyAit');

    if (decoded.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ msg: 'Permission denied, admin access required' });
    }
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
