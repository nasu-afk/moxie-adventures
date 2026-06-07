const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// User Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password required' });
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ success: false, message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)', [name, email, phone || null, hash]);
    const token = jwt.sign({ id: result.insertId, email, name, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ success: true, message: 'Account created', token, user: { id: result.insertId, name, email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM admins WHERE email = ? AND is_active = 1', [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    await db.execute('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);
    const token = jwt.sign({ id: admin.id, email: admin.email, name: admin.name, role: admin.role, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1d' });
    res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
