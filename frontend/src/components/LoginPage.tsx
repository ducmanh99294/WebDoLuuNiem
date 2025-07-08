import React, { useState } from 'react';
import '../assets/css/Login.css';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailOrPhone,
          password: password,
        }),
      });

      const data = await res.json();
      console.log('Dữ liệu trả về từ API:', data);

      if (res.ok && data.success) {
        const token = data.data?.accessToken || '';
        const role = (data.data?.role || '').toLowerCase();
        const name = data.data?.name?.trim() || 'Người dùng'
        const avatar = data.data?.avatar || '/images/default-avatar.png';
        const userId = data.data?.user_id || '';

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role);
        localStorage.setItem('username', name);
        console.log('Role:', role);
        localStorage.setItem('avatar', avatar);   // ✔ avatar
        if (role === 'admin') {
          console.log('Admin detected. Navigating to dashboard...');
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
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

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="otp-link">
            <a href="#">Đăng nhập bằng OTP</a>
          </div>

          <button type="submit" className="btn-login">Đăng nhập</button>
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          <div className="options">
            <label style={{ width: '100px' }}>
              <input type="checkbox" /> Nhớ đến tôi
            </label>
          </div>

          <div className="links">
            <span>Bạn không có tài khoản?
              <Link to="/register">Đăng ký</Link>
            </span><br />
            <a href="#">Quên mật khẩu?</a>
          </div>
        </form>

        <div className="divider">Hoặc đăng nhập bằng</div>

        <div className="social-login">
          <button className="facebook-btn">Facebook</button>
          <button className="google-btn">Google</button>
        </div>
      </div>

      <div className="login-right">
        <img src="/images/bn1.png" alt="" srcSet="" />
      </div>
    </div>
  );
};

export default LoginPage;
