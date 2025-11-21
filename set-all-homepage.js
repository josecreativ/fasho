const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

if (Array.isArray(db.products)) {
  db.products = db.products.map(product => ({
    ...product,
    showOnHomePage: true
  }));
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('All products updated to show on home page!');
} else {
  console.log('No products found in db.json');
} 