const express = require('express');
const pool = require('../db');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// GET: All competitions (any logged-in user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM competitions');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Add competition (admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO competitions (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update competition (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      'UPDATE competitions SET title = $1, description = $2 WHERE id = $3',
      [title, description, id]
    );
    res.json({ message: 'Competition updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE: Remove competition (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM competitions WHERE id = $1', [id]);
    res.json({ message: 'Competition deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
``
