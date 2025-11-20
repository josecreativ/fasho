const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const products = db.products || [];

// Helper: key for grouping
const getKey = (p) => `${p.name.trim().toLowerCase()}|${p.category.trim().toLowerCase()}`;

const merged = {};
products.forEach(product => {
  const key = getKey(product);
  if (!merged[key]) {
    merged[key] = { ...product, colors: [...(product.colors || [])] };
  } else {
    // Merge colors
    merged[key].colors = [...merged[key].colors, ...(product.colors || [])];
  }
});

db.products = Object.values(merged);
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('Duplicate products merged!'); 