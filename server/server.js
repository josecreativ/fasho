const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/video.mp4', express.static(path.join(__dirname, '../public/video.mp4')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

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

// Add this middleware to allow any image field
function anyImagesField(req, res, next) {
  upload.any()(req, res, next);
}

const dbPath = path.join(__dirname, 'db.json');

const readData = () => {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
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
    // Find all files for this color
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

// Get all products
app.get('/api/products', (req, res) => {
  try {
    let db = readData();
    let products = (db.products || []).map(normalizeProduct);

    // Filter by category if provided
    if (req.query.category) {
      products = products.filter(
        p => p.category && p.category.toUpperCase() === req.query.category.toUpperCase()
      );
    }
    
    // Filter by sub-category if provided
    if (req.query.subCategory) {
      products = products.filter(
        p => p.subCategory && p.subCategory.toUpperCase() === req.query.subCategory.toUpperCase()
      );
    }

    // Filter for home page if requested
    if (req.query.home) {
      products = products.filter(p => p.showOnHomePage);
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// Create a new product
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
    res.status(500).json({ message: 'Failed to save product.' });
  }
});

// Update a product
app.put('/api/products/:id', anyImagesField, (req, res) => {
  try {
    const db = readData();
    db.products = db.products || [];
    const productId = parseInt(req.params.id, 10);
    const productIndex = db.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    db.products[productIndex] = normalizeProduct({
      ...db.products[productIndex],
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
    writeData(db);
    res.status(200).json(db.products[productIndex]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const db = readData();
    db.products = db.products || [];
    const productId = parseInt(req.params.id, 10);
    const productIndex = db.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    // Delete all color images
    const productToDelete = db.products[productIndex];
    if (productToDelete.colors) {
      productToDelete.colors.forEach(color => {
        if (color.images) {
          color.images.forEach(img => {
            if (img.url) {
              const imagePath = path.join(__dirname, 'public', img.url.replace('/uploads/', ''));
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              }
            }
          });
        }
      });
    }
    db.products.splice(productIndex, 1);
    writeData(db);
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

// --- Product Search API ---
app.get('/api/products/search', (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    if (!q) {
      return res.json([]);
    }
    const db = readData();
    const products = (db.products || []).map(normalizeProduct);
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search products.' });
  }
});

// --- Category & Sub-category API ---

// Helper function to get the entire DB object and ensure the category structure is correct.
// This will perform a one-time migration if categories are in the old format.
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
    writeData(db); // Save the migrated structure
  }
  return db;
};

// Get all structured categories
app.get('/api/categories', (req, res) => {
  try {
    const db = getDbWithStructuredCategories();
    res.json(db.categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

// Add a new sub-category
app.post('/api/sub-category', (req, res) => {
  try {
    const { mainCategory, name } = req.body;
    if (!mainCategory || !name) {
      return res.status(400).json({ message: 'Main category and sub-category name are required.' });
    }
    
    const db = getDbWithStructuredCategories();
    const mainCat = db.categories[mainCategory.toUpperCase()];

    if (!mainCat) {
      return res.status(404).json({ message: 'Main category not found.' });
    }

    if (!mainCat.sub.find(s => s.toUpperCase() === name.toUpperCase())) {
      mainCat.sub.push(name);
    }
    
    writeData(db);
    res.status(201).json(db.categories);
  } catch (err) {
    console.error("Error adding sub-category:", err);
    res.status(500).json({ message: 'Failed to add sub-category.' });
  }
});

// Delete a sub-category
app.delete('/api/sub-category', (req, res) => {
  try {
    const { mainCategory, name } = req.body;
     if (!mainCategory || !name) {
      return res.status(400).json({ message: 'Main category and sub-category name are required.' });
    }
    
    const db = getDbWithStructuredCategories();
    const mainCat = db.categories[mainCategory.toUpperCase()];
    
    if (!mainCat) {
      return res.status(404).json({ message: 'Main category not found.' });
    }

    mainCat.sub = mainCat.sub.filter(s => s.toUpperCase() !== name.toUpperCase());

    writeData(db);
    res.status(200).json(db.categories);
  } catch (err) {
    console.error("Error deleting sub-category:", err);
    res.status(500).json({ message: 'Failed to delete sub-category.' });
  }
});


// --- Category Banner API ---
app.get('/api/banner', (req, res) => {
  const category = req.query.category;
  if (!category) return res.status(400).json({ message: 'Category is required.' });
  try {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const banner = db.banners && db.banners[category.toUpperCase()];
    res.json({ image: banner || '' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch banner.' });
  }
});

app.put('/api/banner', upload.single('bannerImage'), (req, res) => {
  const category = req.body.category;
  if (!category) return res.status(400).json({ message: 'Category is required.' });
  try {
    const db = JSON.parse(fs.readFileSync(dbPath));
    if (!db.banners) db.banners = {};
    let bannerImage = db.banners[category.toUpperCase()] || '';
    if (req.file) {
      bannerImage = `/uploads/${req.file.filename}`;
    }
    db.banners[category.toUpperCase()] = bannerImage;
    writeData(db);
    res.json({ image: bannerImage });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update banner.' });
  }
});

// --- Currency API ---
// Exchange rates (in a real app, you'd fetch from an API like exchangerate-api.com)
const EXCHANGE_RATES = {
  USD_TO_NGN: 1650, // 1 USD = 1650 NGN (approximate)
  NGN_TO_USD: 1 / 1650
};

// Get current exchange rate
app.get('/api/currency/rate', (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ message: 'From and to currencies are required.' });
    }
    
    const key = `${from.toUpperCase()}_TO_${to.toUpperCase()}`;
    const rate = EXCHANGE_RATES[key];
    
    if (!rate) {
      return res.status(400).json({ message: 'Currency pair not supported.' });
    }
    
    res.json({ rate, from: from.toUpperCase(), to: to.toUpperCase() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get exchange rate.' });
  }
});

// Convert price
app.post('/api/currency/convert', (req, res) => {
  try {
    const { amount, from, to } = req.body;
    
    if (!amount || !from || !to) {
      return res.status(400).json({ message: 'Amount, from, and to currencies are required.' });
    }
    
    const key = `${from.toUpperCase()}_TO_${to.toUpperCase()}`;
    const rate = EXCHANGE_RATES[key];
    
    if (!rate) {
      return res.status(400).json({ message: 'Currency pair not supported.' });
    }
    
    const convertedAmount = amount * rate;
    
    res.json({
      originalAmount: amount,
      convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to convert currency.' });
  }
});

// --- Shop by Brand API ---
app.get('/api/brands', (req, res) => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath));
    res.json(db.brands || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch brands.' });
  }
});

app.put('/api/brands/:label', upload.single('image'), (req, res) => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const label = req.params.label.toUpperCase();
    db.brands = db.brands || [];
    const brandIndex = db.brands.findIndex(b => b.label.toUpperCase() === label);
    if (brandIndex === -1) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    if (req.file) {
      db.brands[brandIndex].image = `/uploads/${req.file.filename}`;
    }
    if (req.body.link) {
      db.brands[brandIndex].link = req.body.link;
    }
    if (req.body.label) {
      db.brands[brandIndex].label = req.body.label;
    }
    writeData(db);
    res.json(db.brands[brandIndex]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update brand.' });
  }
});

// --- Payment Config API ---
function getDbWithPaymentConfig() {
  const db = readData();
  let mutated = false;
  if (!db.config || typeof db.config !== 'object') {
    db.config = {};
    mutated = true;
  }
  if (!db.config.payment || typeof db.config.payment !== 'object') {
    db.config.payment = {
      flutterwavePublicKey: '',
      flutterwaveSecretKey: '',
      flutterwaveWebhookSecret: '',
      paystackPublicKey: '',
      paystackSecretKey: ''
    };
    mutated = true;
  }
  if (mutated) writeData(db);
  return db;
}

// --- Live Chat Config API ---
function getDbWithLiveChatConfig() {
  const db = readData();
  let mutated = false;
  if (!db.config || typeof db.config !== 'object') {
    db.config = {};
    mutated = true;
  }
  if (!db.config.livechat || typeof db.config.livechat !== 'object') {
    db.config.livechat = {
      liveChatCode: '',
      liveChatProvider: '',
      isEnabled: false
    };
    mutated = true;
  }
  if (mutated) writeData(db);
  return db;
}

// Get payment config
app.get('/api/config/payment', (req, res) => {
  try {
    const db = getDbWithPaymentConfig();
    res.json(db.config.payment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment config.' });
  }
});

// Update payment config
app.put('/api/config/payment', (req, res) => {
  try {
    const db = getDbWithPaymentConfig();
    const body = req.body || {};
    db.config.payment.flutterwavePublicKey = body.flutterwavePublicKey ?? db.config.payment.flutterwavePublicKey;
    db.config.payment.flutterwaveSecretKey = body.flutterwaveSecretKey ?? db.config.payment.flutterwaveSecretKey;
    db.config.payment.flutterwaveWebhookSecret = body.flutterwaveWebhookSecret ?? db.config.payment.flutterwaveWebhookSecret;
    db.config.payment.paystackPublicKey = body.paystackPublicKey ?? db.config.payment.paystackPublicKey;
    db.config.payment.paystackSecretKey = body.paystackSecretKey ?? db.config.payment.paystackSecretKey;
    writeData(db);
    res.json(db.config.payment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment config.' });
  }
});

// Get live chat config
app.get('/api/config/livechat', (req, res) => {
  console.log('GET /api/config/livechat called');
  try {
    const db = getDbWithLiveChatConfig();
    console.log('Live chat config:', db.config.livechat);
    res.json(db.config.livechat);
  } catch (err) {
    console.error('Error fetching live chat config:', err);
    res.status(500).json({ message: 'Failed to fetch live chat config.' });
  }
});

// Update live chat config
app.put('/api/config/livechat', (req, res) => {
  console.log('PUT /api/config/livechat called with body:', req.body);
  try {
    const db = getDbWithLiveChatConfig();
    const body = req.body || {};
    db.config.livechat.liveChatCode = body.liveChatCode ?? db.config.livechat.liveChatCode;
    db.config.livechat.liveChatProvider = body.liveChatProvider ?? db.config.livechat.liveChatProvider;
    db.config.livechat.isEnabled = body.isEnabled ?? db.config.livechat.isEnabled;
    writeData(db);
    console.log('Live chat config updated:', db.config.livechat);
    res.json(db.config.livechat);
  } catch (err) {
    console.error('Error updating live chat config:', err);
    res.status(500).json({ message: 'Failed to update live chat config.' });
  }
});

// --- Orders API ---
function getDbWithOrders() {
  const db = readData();
  if (!Array.isArray(db.orders)) {
    db.orders = [];
    writeData(db);
  }
  return db;
}

// Create order
app.post('/api/orders', (req, res) => {
  try {
    const db = getDbWithOrders();
    const body = req.body || {};

    // Basic validation
    if (!body.email || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ message: 'Email and items are required.' });
    }

    const newOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      email: body.email,
      delivery: body.delivery || {},
      paymentMethod: body.paymentMethod || 'UNKNOWN',
      items: body.items,
      subtotal: typeof body.subtotal === 'number' ? body.subtotal : 0,
      note: body.note || ''
    };
    db.orders.push(newOrder);
    writeData(db);
    res.status(201).json({ success: true, orderId: newOrder.id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order.' });
  }
});

// List orders
app.get('/api/orders', (req, res) => {
  try {
    const db = getDbWithOrders();
    const orders = db.orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  try {
    const db = getDbWithOrders();
    const orderId = parseInt(req.params.id, 10);
    const orderIndex = db.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    db.orders.splice(orderIndex, 1);
    writeData(db);
    res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order.' });
  }
});

// --- User Registration ---
// Register a new user
app.post('/api/users', (req, res) => {
  try {
    const db = readData();
    db.users = db.users || [];
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required.' });
    }
    // Check for duplicate email
    if (db.users.some(u => u.email === email)) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const newUser = {
      id: Date.now().toString(), // Store ID as string
      username,
      email,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeData(db);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user.' });
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const db = readData();
    res.json(db.users || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  try {
    const db = readData();
    db.users = db.users || [];
    const userId = req.params.id;
    const userIndex = db.users.findIndex(u => String(u.id) === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }
    db.users.splice(userIndex, 1);
    writeData(db);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

// Catch-all route to serve index.html for React Router (but not for API routes)
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 