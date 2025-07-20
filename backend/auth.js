const express = require('express');
const router = express.Router();
const db = require('./db');

//Api: Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM admins WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = { ...results[0] };
    delete user.password;

    return res.status(200).json({ message: 'Login successful', user });
  });
});

//Api: Logout
router.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
