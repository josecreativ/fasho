const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/video.mp4', express.static(path.join(__dirname, 'public/video.mp4')));
app.use(express.static(path.join(__dirname, 'dist')));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

function anyImagesField(req, res, next) {
  upload.any()(req, res, next);
}

const dbPath = path.join(__dirname, 'db.json');

const readData = () => {
  if (!fs.existsSync(dbPath)) {
    return { products: [], users: [], orders: [], categories: {}, config: {}, brands: [] };
  }
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { products: [], users: [], orders: [], categories: {}, config: {}, brands: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
};

// Helper: parse color data from form
function parseColorsFromRequest(req) {
  let colors = [];
  try {
    colors = JSON.parse(req.body.colors || '[]');
  } catch (e) {
    colors = [];
  }
  colors = colors.map((color, idx) => {
    let images = Array.isArray(color.images) ? [...color.images] : [];
    const files = (req.files || []).filter(f => f.fieldname === `images_${idx}`);
    files.forEach(file => {
      images.push({ url: `/uploads/${file.filename}` });
    });
    return {
      ...color,
      images
    };
  });
  return colors;
}

function normalizeProduct(product) {
  let colors = Array.isArray(product.colors) ? product.colors : [];
  colors = colors.map(c => ({
    name: c.name || '',
    value: c.value || '#000000',
    images: Array.isArray(c.images) ? c.images : []
  }));
  return {
    id: product.id,
    name: product.name || '',
    category: product.category || '',
    subCategory: product.subCategory || '',
    description: product.description || '',
    price: typeof product.price === 'number' ? product.price : 0,
    originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : undefined,
    isOutOfStock: !!product.isOutOfStock,
    showOnHomePage: !!product.showOnHomePage,
    colors
  };
}

// API Routes
app.get('/api/products', (req, res) => {
  try {
    let db = readData();
    let products = (db.products || []).map(normalizeProduct);

    if (req.query.category) {
      products = products.filter(
        p => p.category && p.category.toUpperCase() === req.query.category.toUpperCase()
      );
    }
    
    if (req.query.subCategory) {
      products = products.filter(
        p => p.subCategory && p.subCategory.toUpperCase() === req.query.subCategory.toUpperCase()
      );
    }

    if (req.query.home) {
      products = products.filter(p => p.showOnHomePage);
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

app.post('/api/products', anyImagesField, (req, res) => {
  try {
    const db = readData();
    db.products = db.products || [];
    const newProduct = normalizeProduct({
      id: Date.now(),
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      description: req.body.description,
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      isOutOfStock: req.body.isOutOfStock === 'true',
      showOnHomePage: req.body.showOnHomePage === 'true',
      colors: parseColorsFromRequest(req)
    });
    db.products.push(newProduct);
    writeData(db);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to save product.' });
  }
});

// Categories API
const getDbWithStructuredCategories = () => {
  const db = readData();
  if (!db.categories || typeof db.categories !== 'object' || Array.isArray(db.categories)) {
    db.categories = {
      'WOMEN': { sub: [] },
      'CURVE': { sub: [] },
      'MEN': { sub: [] },
      'KIDS': { sub: [] },
      'BEAUTY': { sub: [] },
    };
    writeData(db);
  }
  return db;
};

app.get('/api/categories', (req, res) => {
  try {
    const db = getDbWithStructuredCategories();
    res.json(db.categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

// Catch-all route to serve React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;