const express = require('express');
const pool = require('../db');
const router = express.Router();

function validate(b) {
  const { title, author, genre, isbn, quantity } = b;
  if (!title || !author || !genre || !isbn) return 'Title, author, genre and ISBN are required.';
  if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) return 'Quantity must be a whole number (0 or more).';
  return null;
}

// READ all
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(rows);
  } catch (e) { next(e); }
});

// READ one
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// CREATE
router.post('/', async (req, res, next) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?,?,?,?,?)',
      [title.trim(), author.trim(), genre.trim(), isbn.trim(), Number(quantity)]
    );
    if (Number(quantity) > 0) {
      await pool.query('INSERT INTO transactions (book_id, type, quantity) VALUES (?,?,?)',
        [result.insertId, 'ADD_STOCK', Number(quantity)]);
    }
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (e) { next(e); }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?',
      [title.trim(), author.trim(), genre.trim(), isbn.trim(), Number(quantity), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Book not found' });
    res.json({ id: Number(req.params.id), ...req.body });
  } catch (e) { next(e); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
