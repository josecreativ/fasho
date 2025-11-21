const fs = require('fs');
const path = require('path');

console.log('Creating deployment package...');

// Files and folders to include in deployment
const deploymentFiles = [
  'server.js',
  'package.json',
  'db.json',
  'dist/',
  'public/',
  'DEPLOYMENT.md'
];

// Create deployment folder
const deployDir = path.join(__dirname, 'deployment');
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir);
}

console.log('Deployment package ready!');
console.log('Upload the following files to your cPanel public_html:');
deploymentFiles.forEach(file => {
  console.log(`- ${file}`);
});

console.log('\nAfter upload:');
console.log('1. Run: npm install');
console.log('2. Run: npm start');
console.log('3. Configure your hosting to use server.js as the startup file');