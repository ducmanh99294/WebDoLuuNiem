import React from 'react';
import '../assets/css/tb.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  onClose: () => void;
}

const AddedToCartPopup: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3 style={{ color: '#009900' }}>🎉 Đã thêm vào giỏ hàng!</h3>
        <p>Sản phẩm đã được thêm thành công vào giỏ hàng của bạn.</p>
        <button className="go-to-cart" onClick={() => navigate('/')}>
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};

export default AddedToCartPopup;
