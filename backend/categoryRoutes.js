const express = require('express');
const db = require('./db');

const router = express.Router();

// API: Add category
router.post('/categories', (req, res) => {
  const { name, parent_id } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const parentIdValue = parent_id ? parent_id : null;
  const sql = "INSERT INTO categories (name, parent_id) VALUES (?, ?)";

  db.query(sql, [name.trim(), parentIdValue], (err, result) => {
    if (err) {
      console.error('Error inserting category:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
  });
});

// API: Get categories with nested subcategories
router.get('/categories', (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err.message);
      return res.status(500).json({ message: "Database error" });
    }
    const rootCategories = results.filter(cat => cat.parent_id === null);
    const subCategories = results.filter(cat => cat.parent_id !== null);
    const nestedCategories = rootCategories.map(rootCat => ({
      id: rootCat.id,
      name: rootCat.name,
      path: `/${rootCat.name.toLowerCase().replace(/\s/g, '-')}`,
      isExpanded: false,
      subcategories: subCategories
        .filter(sub => sub.parent_id === rootCat.id)
        .map(sub => ({
          id: sub.id,
          name: sub.name,
          path: `/${sub.name.toLowerCase().replace(/\s/g, '-')}`,
        }))
    }));
    res.json(nestedCategories);
  });
});

// API: Update category
router.put('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const sql = "UPDATE categories SET name = ? WHERE id = ?";
  db.query(sql, [name.trim(), categoryId], (err, result) => {
    if (err) {
      console.error('Error updating category:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category updated successfully' });
  });
});

// API: Get categories count
router.get('/categories/count', (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM categories', (err, results) => {
    if (err) {
      console.error('Error fetching category count:', err);
      return res.status(500).json({ error: 'Failed to fetch category count' });
    }
    res.json({ count: results[0].count });
  });
});

// API: Delete categories
router.delete('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const sql = 'DELETE FROM categories WHERE id = ?';

  db.query(sql, [categoryId], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: 'Failed to delete category' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  });
});


module.exports = router;
