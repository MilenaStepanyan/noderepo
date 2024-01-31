// userAuthMiddleware.js
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from './config.js';

export const userAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'secretKeyAit');
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
