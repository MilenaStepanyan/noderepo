// userController.js
import bcrypt from 'bcrypt';
import pool from './db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import { validateUserRegistration, validateUserLogin } from './userValidation.js';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const validationErrors = validateUserRegistration({ username, email, password });

  if (validationErrors) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await pool.query(
      'INSERT INTO user (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );

    const newUserId = result[0].insertId;

    const payload = {
      user: {
        id: newUserId,
      },
    };

    jwt.sign(payload, 'secretKeyAit', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate user login data
  const validationErrors = validateUserLogin({ username, password });

  if (validationErrors) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);

    if (userRows.length === 0) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, userRows[0].password);

    if (!isPasswordMatch) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: userRows[0].id,
      },
    };

    jwt.sign(payload, JWT_SECRET || 'secretKeyAit', { expiresIn: '10h' }, (err, token) => {
      if (err) throw err;
      console.log('Generated Token:', token);
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
