import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/PaymentSuccess.css';
import '../assets/css/editproduct.css';

interface PaymentSuccessProps {
  onClose?: () => void; // optional: cho phép đóng modal nếu cần
}

interface SuccessPageProps {
  message?: string;
  description?: string;
  buttonText?: string;
  onClose?: () => void;   // ✅ Đóng modal mà không cần navigate
}

interface ConfirmDeleteProps {
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
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

export const SuccessPage: React.FC<SuccessPageProps> = ({
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

export const CreateProductSuccess: React.FC<SuccessPageProps> = ({   
  message,
  description,
  buttonText,
  onClose 
}) => {
  return (
    <div className="success-container">
      <div className="success-box">
        <button className="close-btn" onClick={onClose}>×</button>

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
      </div>
    </div>
  );
};

export const DeleteProductSuccess: React.FC<SuccessPageProps> = ({   
  message,
  description,
  buttonText,
  onClose }) => {
  return (
    <div className="success-container">
      <div className="success-box">
        <button className="close-btn" onClick={onClose}>×</button>

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
      </div>
    </div>
  );
};

export const UpdateProductSuccess: React.FC<SuccessPageProps> = ({ 
  message,
  description,
  buttonText,
  onClose }) => {
  return (
    <div className="success-container">
      <div className="success-box">
        <button className="close-btn" onClick={onClose}>×</button>

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
      </div>
    </div>
  );
};

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteProps> = ({
  message = 'Bạn có chắc chắn muốn xóa?',
  description = 'Hành động này không thể hoàn tác.',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="success-container">
      <div className="success-box">
        <button className="close-btn" onClick={onCancel}>×</button>

        <div className="success-icon">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="36" fill="#F44336" />
            <path d="M22 22 L50 50 M50 22 L22 50" stroke="#fff" strokeWidth="5" fill="none" />
          </svg>
        </div>

        <h2 className="success-message">{message}</h2>
        <p className="success-description">{description}</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="success-button" style={{ backgroundColor: '#F44336' }} onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="success-button" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const TokenExpiredModal: React.FC<ConfirmDeleteProps> = ({ onConfirm }) => {
  return (
    <div className="token-expired-overlay">
      <div className="token-expired-modal">
        <h2>Phiên đăng nhập đã hết hạn</h2>
        <p>Vui lòng đăng nhập lại để tiếp tục.</p>
        <button onClick={onConfirm}>Đăng nhập lại</button>
      </div>
    </div>
  );
};