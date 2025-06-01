// src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from '../header';
import HomePage from '../pages/homepage';
import LoginPage from '../LoginPage';
import Footer from '../Fotter';
import Register from '../Register';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register/>} />

        {/* Chuyển hướng từ /signin sang /login */}
        <Route path="/signin" element={<Navigate to="/login" replace />} />

        {/* Trang không tìm thấy */}
        {/* Mọi route không khớp thì chuyển về / hoặc 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
