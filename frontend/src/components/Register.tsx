
import React, { useState } from 'react';
import '../assets/css/Register.css';
import { getOTP, registerUser } from '../services/authService';
import type { RegisterSuccessResponse } from '../types/auth/RegisterResponse';
import { Eye, EyeOff } from 'lucide-react';
const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Vui lòng nhập email.');
    if (!password) return setError('Vui lòng nhập mật khẩu.');
    if (!rePassword) return setError('Vui lòng nhập lại mật khẩu.');
    if (password.length < 6) return setError('Mật khẩu phải có ít nhất 6 ký tự.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Email không hợp lệ.');
    if (rePassword.length < 6) return setError('Mật khẩu nhập lại phải có ít nhất 6 ký tự.');
    if (rePassword.length > 20) return setError('Mật khẩu nhập lại không được quá 20 ký tự.');
    if (password.length > 20) return setError('Mật khẩu không được quá 20 ký tự.');
    if (password !== rePassword) return setError('Mật khẩu không khớp.');
    const result = await getOTP(email, 'register')
    if (result.success) {
      alert(`Mã OTP đã được gửi đến email ${email}.`);
    } else {
      return setError(result.message);
    }

    setStep('otp');
    setError('');
  };

  const handleRefreshOTP = async (e:React.FormEvent) => {
    e.preventDefault();
    const result = await getOTP(email, 'register')
    if (result.success) {
      alert(`Mã OTP đã được gửi đến email ${email}.`);
    } else {
      return setError(result.message);
    }
    setStep('otp');
    setError('');
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setError('Vui lòng nhập mã OTP.');
    // regiter
    if (otp.length !== 6) return setError('Mã OTP phải có 6 chữ số.');
    // Mô phỏng xác thực OTP
    const result = await registerUser(email, otp, password)
    if (result.success) {
      alert('Đăng ký thành công!');
      // Redirect to login or dashboard
      const { accessToken, data } = result as RegisterSuccessResponse;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('role', 'user');

      window.location.href = '/login';
    } else {
      setOtp('');
      setStep('form');
      return setError(result.message);
    }
    setError('');
    setStep('form');
    setEmail('');
    setPassword('');
    setOtp('');
  }
  console.log(showPassword)
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: '40px' }}
            />

            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</span>

            <input
              type="text"
              placeholder="re-password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              style={{ paddingRight: '40px' }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</span>

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
            <div onClick={() => handleRefreshOTP}>Gủi lại mã OTP!</div>
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
