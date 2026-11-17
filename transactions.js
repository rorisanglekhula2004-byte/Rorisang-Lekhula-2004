const express = require('express');
const pool = require('../db');
const router = express.Router();

// READ history (newest first) with book title and user name
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.type, t.quantity, t.created_at, t.book_id, t.user_id,
              b.title AS book_title, u.name AS user_name
       FROM transactions t
       JOIN books b ON b.id = t.book_id
       LEFT JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC, t.id DESC`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// CREATE: ADD_STOCK increases stock, BORROW deducts stock (atomic)
router.post('/', async (req, res, next) => {
  const { book_id, user_id, type, quantity } = req.body;
  const qty = Number(quantity);
  if (!book_id || !['ADD_STOCK', 'BORROW'].includes(type)) return res.status(400).json({ error: 'Valid book and type are required.' });
  if (!Number.isInteger(qty) || qty <= 0) return res.status(400).json({ error: 'Quantity must be a positive whole number.' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT quantity FROM books WHERE id = ? FOR UPDATE', [book_id]);
    if (!rows.length) { await conn.rollback(); return res.status(404).json({ error: 'Book not found' }); }

    if (type === 'BORROW' && rows[0].quantity < qty) {
      await conn.rollback();
      return res.status(400).json({ error: `Not enough stock. Only ${rows[0].quantity} available.` });
    }
    const delta = type === 'ADD_STOCK' ? qty : -qty;
    await conn.query('UPDATE books SET quantity = quantity + ? WHERE id = ?', [delta, book_id]);
    const [result] = await conn.query(
      'INSERT INTO transactions (book_id, user_id, type, quantity) VALUES (?,?,?,?)',
      [book_id, user_id || null, type, qty]);
    await conn.commit();
    res.status(201).json({ id: result.insertId, book_id, user_id, type, quantity: qty });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
});

module.exports = router;
