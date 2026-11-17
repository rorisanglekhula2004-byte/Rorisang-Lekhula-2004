const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

const FIELDS = 'id, name, membership_id, role, created_at';

// LOGIN
router.post('/login', async (req, res, next) => {
  const { membership_id, password } = req.body;
  if (!membership_id || !password) return res.status(400).json({ error: 'Membership ID and password are required.' });
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE membership_id = ?', [membership_id]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid membership ID or password.' });
    }
    const { password_hash, ...user } = rows[0];
    res.json(user);
  } catch (e) { next(e); }
});

// READ all
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT ${FIELDS} FROM users ORDER BY name`);
    res.json(rows);
  } catch (e) { next(e); }
});

// CREATE
router.post('/', async (req, res, next) => {
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id || !password) return res.status(400).json({ error: 'Name, membership ID and password are required.' });
  if (!['admin', 'member'].includes(role)) return res.status(400).json({ error: 'Role must be admin or member.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, membership_id, role, password_hash) VALUES (?,?,?,?)',
      [name.trim(), membership_id.trim(), role, hash]
    );
    res.status(201).json({ id: result.insertId, name, membership_id, role });
  } catch (e) { next(e); }
});

// UPDATE (password optional)
router.put('/:id', async (req, res, next) => {
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id) return res.status(400).json({ error: 'Name and membership ID are required.' });
  if (!['admin', 'member'].includes(role)) return res.status(400).json({ error: 'Role must be admin or member.' });
  try {
    let result;
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      const hash = await bcrypt.hash(password, 10);
      [result] = await pool.query(
        'UPDATE users SET name=?, membership_id=?, role=?, password_hash=? WHERE id=?',
        [name.trim(), membership_id.trim(), role, hash, req.params.id]);
    } else {
      [result] = await pool.query(
        'UPDATE users SET name=?, membership_id=?, role=? WHERE id=?',
        [name.trim(), membership_id.trim(), role, req.params.id]);
    }
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ id: Number(req.params.id), name, membership_id, role });
  } catch (e) { next(e); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
