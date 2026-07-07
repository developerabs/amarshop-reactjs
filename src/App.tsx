/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Ecommerce Application Main Entry
import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubNavbar from "./components/SubNavbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import CartDrawer from "./components/CartDrawer";
import CategoryOverlay from "./components/CategoryOverlay";
import WishlistDrawer from "./components/WishlistDrawer";
import ProfileDrawer from "./components/ProfileDrawer";
import { CommerceProvider, useCommerce } from "./context/CommerceContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ModalProvider } from "./context/ModalContext";
import NotificationContainer from "./components/NotificationContainer";
import ModalContainer from "./components/ModalContainer";
import { SettingsProvider } from "./context/SettingsContext";

const Home = lazy(() => import("./pages/Home"));
const AllProducts = lazy(() => import("./pages/AllProducts"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const FlashDeal = lazy(() => import("./pages/FlashDeal"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Contact = lazy(() => import("./pages/Contact"));
const Compare = lazy(() => import("./pages/Compare"));
const SellerShop = lazy(() => import("./pages/SellerShop"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Checkout = lazy(() => import("./pages/Checkout"));

function AppShell() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const { cartItems, updateCartQuantity, removeFromCart, addToCart } = useCommerce();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />
      <SubNavbar onCategoriesClick={() => setIsCategoryOverlayOpen(true)} />

      <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-gray-600">Loading page…</div>}>
        <Routes>
          <Route path="/" element={<Home onCategorySeeMore={() => setIsCategoryOverlayOpen(true)} onAddToCart={addToCart} />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/product/:productName" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/flash-deal" element={<FlashDeal />} />
          <Route path="/seller-shop" element={<SellerShop />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders/:orderId" element={<OrderTracking />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
      <BottomNav
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <CategoryOverlay isOpen={isCategoryOverlayOpen} onClose={() => setIsCategoryOverlayOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <ModalProvider>
          <SettingsProvider>
            <CommerceProvider>
              <AppShell />
              <NotificationContainer />
              <ModalContainer />
            </CommerceProvider>
          </SettingsProvider>
        </ModalProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}


