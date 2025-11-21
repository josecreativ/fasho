# Deployment Guide for cPanel Hosting

## Overview
This application is now configured as a unified full-stack app where the Express server serves both the API and the built React frontend from a single deployment.

## Quick Deployment Steps

### 1. Prepare for Deployment
```bash
npm run build
```

### 2. Files to Upload to cPanel
Upload these files/folders to your cPanel public_html directory:

**Essential Files:**
- `server.js` - Main server file (entry point)
- `package.json` - Dependencies configuration
- `db.json` - Database file with your data
- `.htaccess` - Apache configuration for Node.js
- `dist/` - Built React frontend (created by npm run build)
- `public/` - Static assets and uploaded images

**Optional but Recommended:**
- `DEPLOYMENT.md` - This guide

### 3. cPanel Setup
1. **Enable Node.js** in your cPanel
2. **Set startup file** to `server.js`
3. **Install dependencies**: Run `npm install` in cPanel terminal
4. **Start the app**: Run `npm start` or let cPanel auto-start

### 4. Configuration
- **Port**: Automatically uses `process.env.PORT` (provided by hosting)
- **Database**: File-based (db.json) - no external database needed
- **Uploads**: Stored in `public/uploads/` directory

## File Structure After Deployment
```
public_html/
├── server.js          # 🚀 Main server (entry point)
├── package.json       # 📦 Dependencies
├── db.json           # 🗄️ Database
├── .htaccess         # ⚙️ Apache config
├── dist/             # 🌐 Built React app
│   ├── index.html
│   ├── assets/
│   └── ...
├── public/           # 📁 Static files
│   ├── uploads/      # 🖼️ Product images
│   ├── video.mp4     # 🎥 Hero video
│   └── ...
└── node_modules/     # 📚 Dependencies (after npm install)
```

## Key Changes Made for Unified Deployment

✅ **API URLs**: Changed from `http://localhost:3001/api/*` to `/api/*`  
✅ **Image URLs**: Changed from `http://localhost:3001/uploads/*` to `/uploads/*`  
✅ **Server Config**: Uses `process.env.PORT` for hosting compatibility  
✅ **Static Serving**: Express serves both API and React app  
✅ **Build Process**: Single build command creates production-ready app  

## Testing Locally
```bash
npm run build    # Build frontend
npm start        # Start unified server
```
Visit: `http://localhost:3001`

## Troubleshooting
- **Port Issues**: Server auto-detects port from hosting environment
- **File Permissions**: Ensure `public/uploads/` is writable
- **Node.js Version**: Ensure your hosting supports Node.js 16+
- **Dependencies**: Run `npm install` if modules are missing

## Admin Access
- Admin Panel: `/admin/login`
- Default setup requires manual user creation via API

Your e-commerce app is now ready for cPanel deployment! 🚀