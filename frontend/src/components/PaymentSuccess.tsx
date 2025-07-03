import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/PaymentSuccess.css';

interface PaymentSuccessProps {
  onClose?: () => void; // optional: cho phép đóng modal nếu cần
}

export const ContactSuccess: React.FC<PaymentSuccessProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="payment-success-overlay">
      <div className="payment-success-modal">
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}

        {/* ✅ SVG vẽ dấu V */}
        <svg className="checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" d="M14 27 L22 35 L38 18" fill="none" />
        </svg>

        <h2>Gửi lời nhắn thành công!</h2>
        <p>Cảm ơn sự góp ý của bạn.</p>
        <button onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        <br />
        <br />
        {/* <p style={{color:"black"}}>bạn có thể xem đơn hàng của mình tại đây</p> <Link to={'/order'} ><p style={{color:"black"}}> tại đây </p></Link> */}
      </div>
    </div>
  );
};

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="payment-success-overlay">
      <div className="payment-success-modal">
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}

        {/* ✅ SVG vẽ dấu V */}
        <svg className="checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" d="M14 27 L22 35 L38 18" fill="none" />
        </svg>

        <h2>Thanh toán thành công!</h2>
        <p>Đơn hàng của bạn đã được xử lý.</p>
        <button onClick={() => navigate('/')}>Quay về trang chủ</button>
        <br />
        <br />
        <p style={{color:"black"}}>bạn có thể xem đơn hàng của mình tại đây</p> <Link to={'/order'} ><p style={{color:"black"}}> tại đây </p></Link>
      </div>
    </div>
  );
};
