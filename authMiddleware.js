// authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

export const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'secretKeyAit');
    req.user = decoded.user;

    if (req.user.role !== 'admin') {
      console.log('Not an admin');
      return res.status(403).json({ msg: 'Permission denied, admin access required' });
    }

    console.log('Decoded:', decoded); 

    next();
  } catch (err) {
    console.log('Token verification failed');
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
