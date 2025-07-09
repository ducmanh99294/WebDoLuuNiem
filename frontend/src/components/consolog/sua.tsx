import React from 'react';
import '../../assets/css/editproduct.css';

interface SuccessPageProps {
  message?: string;
  description?: string;
  buttonText?: string;
  onClose?: () => void;   // ✅ Đóng modal mà không cần navigate
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  message = 'Cập nhật thành công',
  description = 'Hành động của bạn đã được xử lý.',
  buttonText = 'Đóng',
  onClose,
}) => {
  return (
    <div className="success-container">
      <div className="success-box">
        <button className="close-btn" onClick={onClose}>×</button> {/* ✅ Không dùng navigate */}

        <div className="success-icon">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="36" fill="#4CAF50" />
            <path d="M22 37 L32 47 L52 27" stroke="#fff" strokeWidth="5" fill="none" />
          </svg>
        </div>

        <h2 className="success-message">{message}</h2>
        <p className="success-description">{description}</p>

        <button className="success-button" onClick={onClose}>
          {buttonText}
        </button>

        <p className="success-link">Cập nhật sản phẩm thành công</p>
      </div>
    </div>
  );
};

export default SuccessPage;
