import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from '../header';
import HomePage from '../pages/homepage';
import LoginPage from '../LoginPage';
import Footer from '../Fotter';
import Register from '../Register';
import About from '../pages/about'
import DetailProduct from '../pages/DetailProduct';
import NewsPage from '../pages/newspage';
import Contact from '../pages/contact';
import Dashboard from '../pages/Dashboard';

const AppRouter: React.FC = () => {
  // tách n
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/newpage" element={<NewsPage/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/about" element={<About/>} />
        <Route path="//product-detail/:_id" element={<DetailProduct />} />
          {/* Chuyển hướng từ /signin sang /login */}
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
    // tách 
  );
};

export default AppRouter;
