const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "_" + uniqueSuffix);
  }
});
const upload = multer({ storage });

// API: Create Product
router.post('/product', upload.array('images'), (req, res) => {
  const { name, description, price, quantity, status } = req.body;

  if (!name || !price || !quantity || !status || !req.body.categories) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let categories;
  try {
    categories = JSON.parse(req.body.categories);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid category format' });
  }

  const imagePaths = req.files.map(file => `http://localhost:8180/images/${file.filename}`);
  const productValues = [name, description, price, quantity, status, imagePaths[0] || null];

  const insertProductSql = `
    INSERT INTO products (name, description, price, quantity, status, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertProductSql, productValues, (err, result) => {
    if (err) {
      console.error('Product insert error:', err);
      return res.status(500).json({ error: 'Error inserting product' });
    }

    const productId = result.insertId;

    if (categories.length === 0) {
      return res.json({ message: 'Product created without categories' });
    }

    const linkSql = `INSERT INTO product_categories (product_id, category_id) VALUES ?`;
    const linkValues = categories.map(catId => [productId, catId]);

    db.query(linkSql, [linkValues], (err2) => {
      if (err2) {
        console.error('Category link error:', err2);
        return res.status(500).json({ error: 'Error linking categories' });
      }

      res.json({ message: 'Product created successfully' });
    });
  });
});

// API: Get All Products
router.get('/products', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.name, p.description, p.price, p.quantity, p.status, p.image_url,
      GROUP_CONCAT(c.name) AS categories
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    const products = results.map(product => ({
      ...product,
      categories: product.categories ? product.categories.split(',') : [],
    }));

    res.json(products);
  });
});

// API: Get Product Count
router.get('/products/count', (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM products';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching product count:', err);
      return res.status(500).json({ error: 'Failed to fetch product count' });
    }
    res.json({ count: results[0].count });
  });
});

router.get('/products/lowcount', (req, res) => {
  const totalCountSql = 'SELECT COUNT(*) AS totalCount FROM products';
  const lowQtyCountSql = 'SELECT COUNT(*) AS lowQtyCount FROM products WHERE quantity <= 5';

  db.query(totalCountSql, (err, totalResults) => {
    if (err) {
      console.error('Error fetching total product count:', err);
      return res.status(500).json({ error: 'Failed to fetch total product count' });
    }

    db.query(lowQtyCountSql, (err, lowQtyResults) => {
      if (err) {
        console.error('Error fetching low quantity product count:', err);
        return res.status(500).json({ error: 'Failed to fetch low quantity product count' });
      }

      res.json({
        totalCount: totalResults[0].totalCount,
        lowQuantityCount: lowQtyResults[0].lowQtyCount,
      });
    });
  });
});

// API: Get Price Count
router.get('/products/totalprice', (req, res) => {
  const sql = 'SELECT SUM(price) AS totalPrice FROM products';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching total product price:', err);
      return res.status(500).json({ error: 'Failed to fetch total product price' });
    }
    const totalPrice = results[0].totalPrice || 0;
    res.json({ totalPrice });
  });
});


// API: Get Single Product by ID
router.get('/product/:id', (req, res) => {
  const productId = req.params.id;

  // Query to get product info
  const productQuery = 'SELECT * FROM products WHERE id = ?';

  db.query(productQuery, [productId], (err, productResults) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResults[0];

    // Query to get related categories for this product
    const categoriesQuery = `
      SELECT c.id, c.name, c.parent_id
      FROM categories c
      JOIN product_categories pc ON c.id = pc.category_id
      WHERE pc.product_id = ?
    `;

    db.query(categoriesQuery, [productId], (err, categoryResults) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      product.categories = categoryResults;
      res.json(product);
    });
  });
});

// API: Update Product
router.put('/product/:id', upload.array('images'), (req, res) => {
  const productId = req.params.id;
  const { name, description, price, quantity, status } = req.body;

  if (!name || !price || !quantity || !status || !req.body.categories) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let categories;
  try {
    categories = JSON.parse(req.body.categories);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid category format' });
  }

  const imagePaths = req.files.length > 0 
    ? req.files.map(file => `http://localhost:8180/images/${file.filename}`)
    : [];

  const updateSql = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, quantity = ?, status = ?${imagePaths.length ? ', image_url = ?' : ''}
    WHERE id = ?
  `;

  const values = imagePaths.length
    ? [name, description, price, quantity, status, imagePaths[0], productId]
    : [name, description, price, quantity, status, productId];

  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error('Product update error:', err);
      return res.status(500).json({ error: 'Error updating product' });
    }

    const deleteSql = `DELETE FROM product_categories WHERE product_id = ?`;
    db.query(deleteSql, [productId], (delErr) => {
      if (delErr) {
        console.error('Error deleting old categories:', delErr);
        return res.status(500).json({ error: 'Error updating categories' });
      }

      if (categories.length === 0) {
        return res.json({ message: 'Product updated without categories' });
      }

      const linkSql = `INSERT INTO product_categories (product_id, category_id) VALUES ?`;
      const linkValues = categories.map(catId => [productId, catId]);

      db.query(linkSql, [linkValues], (linkErr) => {
        if (linkErr) {
          console.error('Category link error:', linkErr);
          return res.status(500).json({ error: 'Error linking categories' });
        }

        res.json({ message: 'Product updated successfully' });
      });
    });
  });
});

// API: Delete Product
router.delete('/product/:id', (req, res) => {
  const productId = req.params.id;

  const deleteQuery = 'DELETE FROM products WHERE id = ?';

  db.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ message: 'Product deleted successfully' });
  });
})


module.exports = router;
