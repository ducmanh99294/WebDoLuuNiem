import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from '../header';
import Footer from '../Fotter';

import HomePage from '../pages/homepage';
import LoginPage from '../LoginPage';
import Register from '../Register';
import About from '../pages/about';
import DetailProduct from '../pages/DetailProduct';
import NewsPage from '../pages/newspage';
import Contact from '../pages/contact';
import Dashboard from '../pages/Dashboard';
import CartPage from '../pages/cart';
import Editprofile from '../pages/Editprofile';
import Profile from '../pages/profile';

// Component bọc logic router
const AppContent: React.FC = () => {
  const location = useLocation();

  // Các trang không cần header và footer
  const noLayoutRoutes = [ '/register', '/dashboard'];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpage" element={<NewsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/product-detail/:_id" element={<DetailProduct />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/editprofile" element={<Editprofile />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default AppRouter;
