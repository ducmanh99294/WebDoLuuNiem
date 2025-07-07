
import React, { useState } from 'react';
import '../assets/css/Register.css';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState<'zalo' | 'sms' | ''>('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return setError('Vui lòng nhập email hoặc số điện thoại.');
    if (!method) return setError('Vui lòng chọn phương thức OTP.');
    // Mô phỏng gửi OTP
    alert('Mã OTP đã được gửi! (mock: 123456)');
    setStep('otp');
    setError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      alert('Đăng ký thành công!');
      // Reset lại form
      setContact('');
      setMethod('');
      setOtp('');
      setStep('form');
    } else {
      setError('Mã OTP không chính xác.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>{step === 'form' ? 'Đăng Ký' : 'Nhập mã OTP'}</h2>
        <p>
          <strong>Shop Mall</strong> Đăng nhập hoặc tạo tài khoản
          <span className="highlight"> Chúng Tôi </span>
          phục vụ bạn tốt hơn nhé.<br />
        </p>

        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

        {step === 'form' ? (
          <form onSubmit={handleSubmit}>
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
              Tiếp tục
            </button>

            <div className="links">
              <span>
                Bạn đã có tài khoản <a href="/login">Đăng nhập</a>
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
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

      <div className="login-right">{/* Có thể thêm ảnh hoặc trang trí tại đây */}
        <img src="/images/bn3.png" alt=""/>
      </div>
    </div>
  );
};

export default LoginPage;
