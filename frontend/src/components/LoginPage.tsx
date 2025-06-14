
// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import '../assets/css/Login.css';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [useOtp, setUseOtp] = useState(false); // kiểm tra có đăng nhập bằng OTP không
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState<'zalo' | 'sms' | ''>('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return setError('Vui lòng nhập email hoặc số điện thoại.');
    if (!method) return setError('Vui lòng chọn phương thức OTP.');
    setError('');
    alert('Mã OTP đã được gửi (mock: 123456)');
    setStep('otp');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      alert('Đăng nhập thành công!');
      navigate('/');
    } else {
      setError('Mã OTP không đúng');
    }
  };

  const handleNormalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập thường tại đây nếu cần (mock)
    alert('Đăng nhập thành công!');
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Đăng nhập</h2>
        <p>
          <strong>Shop Mall</strong> chào bạn, bạn cần đăng kí hoặc đăng nhập tài khoản
          trước khi mua hàng để nhận được nhiều ưu đãi của <span className="highlight">Shop Mall</span>
          phục vụ bạn tốt hơn nhé.<br />
          Cảm ơn bạn <span className="highlight">rất nhiều!</span>
        </p>

        {/* Nếu chưa chọn OTP */}
        {!useOtp && (
          <form onSubmit={handleNormalLogin}>
            <input type="text" placeholder="Email hoặc số điện thoại" required />
            <input type="password" placeholder="Mật khẩu" required />

            <div className="otp-link">
              <a href="#" onClick={(e) => { e.preventDefault(); setUseOtp(true); }}>Đăng nhập bằng OTP</a>
            </div>

            <button type="submit" className="btn-login">Đăng nhập</button>

            <div className="options">
              <label style={{ width: '100px' }}>
                <input type="checkbox" /> Nhớ đến tôi
              </label>
            </div>

            <div className="links">
              <span>
                Bạn không có tài khoản? <a href="/register">Đăng ký</a>
              </span><br />
              <a href="#">Quên mật khẩu?</a>
            </div>
          </form>
        )}

        {/* Nếu chọn OTP */}
        {useOtp && step === 'form' && (
          <form onSubmit={handleOtpLogin}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
              type="text"
              placeholder="Email hoặc số điện thoại"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <div className="options" style={{ marginTop: 12 }}>
              <label>
                <input
                  type="radio"
                  checked={method === 'zalo'}
                  onChange={() => setMethod('zalo')}
                />{' '}
                Zalo OTP
              </label>
              <label>
                <input
                  type="radio"
                  checked={method === 'sms'}
                  onChange={() => setMethod('sms')}
                />{' '}
                SMS OTP
              </label>
            </div>

            <button type="submit" className="btn-login" style={{ marginTop: 12 }}>
              Gửi mã OTP
            </button>
          </form>
        )}

        {/* Nhập OTP */}
        {useOtp && step === 'otp' && (
          <form onSubmit={handleOtpVerify}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" className="btn-login" style={{ marginTop: 12 }}>
              Xác nhận
            </button>
          </form>
        )}

        <div className="divider">Hoặc đăng nhập bằng</div>

        <div className="social-login">
          <a
            href="https://www.facebook.com/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button" className="facebook-btn">Facebook</button>
          </a>
          <a
            href="https://accounts.google.com/signin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button" className="google-btn">Google</button>
          </a>
        </div>
      </div>

      <div className="login-right">{/* trang trí bên phải nếu cần */}</div>
    </div>
  );
};

export default LoginPage;
