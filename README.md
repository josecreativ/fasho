# 🛍️ Allure Fashion - E-commerce Application

A modern, full-stack e-commerce platform built with React, Node.js, and Express.

## 🌟 Live Demo
- **Frontend**: [Live Demo](https://your-app.onrender.com)
- **Admin Panel**: [Admin Dashboard](https://your-app.onrender.com/admin/login)

## 🚀 Features

### Customer Features
- 🛒 **Shopping Cart** - Add/remove products, quantity management
- 🔍 **Product Search** - Real-time search functionality
- 📱 **Responsive Design** - Mobile-first approach
- 💰 **Currency Switcher** - USD/NGN conversion
- 🎨 **Product Colors** - Multiple color variants with image galleries
- 📦 **Categories** - Women, Men, Kids, Beauty, Curve collections
- 💳 **Payment Integration** - Flutterwave & Paystack ready

### Admin Features
- 📊 **Product Management** - CRUD operations with image uploads
- 📈 **Order Tracking** - View and manage customer orders
- 👥 **User Management** - Customer registration tracking
- 🏷️ **Category Management** - Dynamic category/subcategory system
- 💬 **Live Chat Setup** - Configurable chat widgets
- ⚙️ **Payment Configuration** - Easy payment gateway setup

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Multer** - File upload handling
- **JSON Database** - File-based data storage
- **CORS** - Cross-origin resource sharing

### UI/UX
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form validation
- **Sonner** - Toast notifications

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── ProductCard.tsx # Product display component
│   │   └── ...
│   ├── pages/              # Route components
│   │   ├── admin/          # Admin panel pages
│   │   ├── Index.tsx       # Homepage
│   │   ├── CategoryPage.tsx# Category listings
│   │   └── ...
│   ├── store/              # Context providers
│   │   ├── CartContext.tsx # Shopping cart state
│   │   └── CurrencyContext.tsx
│   └── lib/                # Utilities
├── public/                 # Static assets
├── server.js              # Express server
├── db.json               # JSON database
└── dist/                 # Built application
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/allure-fashion-ecommerce.git
   cd allure-fashion-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the frontend**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Frontend: `http://localhost:3001`
   - Admin: `http://localhost:3001/admin/login`

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
npm run server       # Start Express server
```

## 📦 Deployment

### Render.com (Recommended)
1. Connect GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Deploy automatically

### Other Platforms
- **Railway**: Auto-deployment from GitHub
- **Heroku**: Use provided Procfile
- **Netlify + Backend**: Split deployment

## 🎨 Customization

### Adding Products
1. Access admin panel at `/admin/login`
2. Navigate to Products section
3. Add products with multiple colors and images
4. Set categories and pricing

### Styling
- Modify `tailwind.config.js` for theme customization
- Update components in `src/components/ui/`
- Customize colors in `src/index.css`

## 📊 Database Schema

The application uses a JSON file database with the following structure:

```json
{
  "products": [...],      // Product catalog
  "categories": {...},    // Category structure
  "orders": [...],        // Customer orders
  "users": [...],         // Registered users
  "config": {...},        // App configuration
  "brands": [...]         // Brand information
}
```

## 🔐 Security Features

- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Environment variable support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built by [Your Name] - Full Stack Developer

- **Portfolio**: [Your Portfolio URL]
- **LinkedIn**: [Your LinkedIn]
- **Email**: [Your Email]

---

⭐ **Star this repository if you found it helpful!**