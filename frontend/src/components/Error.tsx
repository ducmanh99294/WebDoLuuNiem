import React from 'react';
import '../assets/css/Error.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  onClose: () => void;
}

const CartError: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('Cart_id');

    // Chuyển hướng sang trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="cart-error-overlay">
      <div className="cart-error-box">
        {/* Nút đóng popup */}
        <button className="cart-error-close" onClick={onClose}>×</button>
          <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
    className="error-icon"
  >
    <circle cx="40" cy="40" r="38" fill="#FCEAEA" stroke="#E74C3C" strokeWidth="4" />
    <line x1="26" y1="26" x2="54" y2="54" stroke="#E74C3C" strokeWidth="6" strokeLinecap="round" />
    <line x1="54" y1="26" x2="26" y2="54" stroke="#E74C3C" strokeWidth="6" strokeLinecap="round" />
  </svg>
        {/* Tiêu đề lỗi */}
        <h3 className="cart-error-title">Không thể tạo giỏ hàng!</h3>

        {/* Thông báo lỗi */}
        <p className="cart-error-message">
          Vui lòng đăng nhập lại để tiếp tục mua sắm.
        </p>

        {/* Nút đăng nhập lại */}
        <button className="cart-error-button" onClick={handleLoginRedirect}>
          Đăng nhập lại
        </button>
      </div>
    </div>
  );
};

export default CartError;
