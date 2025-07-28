import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../header';
import Footer from '../Fotter';
import SearchPage from '../search'; 
import HomePage from '../pages/homepage';
import LoginPage from '../LoginPage';
import Register from '../Register';
import About from '../pages/about';
import DetailProduct from '../pages/DetailProduct';
import Blog from '../pages/Blog';
import Contact from '../pages/contact';
import Dashboard from '../pages/Dashboard';
import CartPage from '../pages/cart';
import Editprofile from '../pages/Editprofile';
import Profile from '../pages/profile';
import User from '../pages/user';
import Checkout from '../pages/checkout';
import OrderDetail from '../pages/OrderDetail';
import OrderList from '../pages/listOrder';
import BlogDetail from '../pages/BlogDetail';
import CategoryPage from '../pages/category';
import ReturnForm from '../pages/ReturnForm';
import AdminReturnDetail from '../pages/admin/AdminReturnDetail';
import { TokenWatcher } from '../TokenWatcher'

const AppContent: React.FC = () => {
  const location = useLocation();
  const noLayoutRoutes = ['', '/dashboard', '/user'];
  const hideLayout = noLayoutRoutes.includes(location.pathname);
  const userRole = localStorage.getItem('role'); // sửa lại từ 'admin' thành 'role'

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpage" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/product-detail/:_id" element={<DetailProduct />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/editprofile" element={<Editprofile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:_id" element={<OrderDetail />} />
        <Route path="/order" element={<OrderList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/return-form/:orderId" element={<ReturnForm />} />
        <Route path="/admin/returns/:returnId" element={<AdminReturnDetail />} />
        {/* <Route path="/category" element={<CategoryPage />} /> */}


        {/* CHỈ admin mới được vào */}
        <Route
          path="/dashboard"
          element={userRole === 'admin' ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/user"
          element={userRole === 'admin' ? <User /> : <Navigate to="/" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        
      {!hideLayout && <Footer />}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <TokenWatcher />
      <AppContent />
    </Router>
  );
};

export default AppRouter;
