import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/admin/Admin";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./routes/ProtectedRoute";
import FlutterwaveSetup from "./pages/admin/FlutterwaveSetup";
import PaystackSetup from "./pages/admin/PaystackSetup";
import LiveChatSetup from "./pages/admin/LiveChatSetup";
import NotFound from "./pages/NotFound";
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import { CartProvider } from './store/CartContext';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import { CurrencyProvider } from './store/CurrencyContext';
import UserProfilePage from './pages/UserProfilePage';
import Header from './components/Header';
import LiveChat from './components/LiveChat';

const queryClient = new QueryClient();

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <Header />
    <Outlet />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LiveChat />
      <CurrencyProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/settings/flutterwave" element={<ProtectedRoute><FlutterwaveSetup /></ProtectedRoute>} />
            <Route path="/admin/settings/paystack" element={<ProtectedRoute><PaystackSetup /></ProtectedRoute>} />
            <Route path="/admin/settings/livechat" element={<ProtectedRoute><LiveChatSetup /></ProtectedRoute>} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/women" element={<CategoryPage category="WOMEN" />} />
              <Route path="/curve" element={<CategoryPage category="CURVE" />} />
              <Route path="/men" element={<CategoryPage category="MEN" />} />
              <Route path="/kids" element={<CategoryPage category="KIDS" />} />
              <Route path="/beauty" element={<CategoryPage category="BEAUTY" />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </CurrencyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
