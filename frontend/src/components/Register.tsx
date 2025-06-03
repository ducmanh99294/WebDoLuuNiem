// src/pages/LoginPage.tsx
import React from 'react';
import '../assets/css/Register.css';
import { Link } from 'react-router-dom';
const LoginPage: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Đăng Ký</h2>
        <p>
          <strong>Shop Mall</strong> Đăng nhập hoặc tạo tài khoản     
           <span className="highlight">   Chúng Tôi   </span>
          phục vụ bạn tốt hơn nhé.<br />
        </p>

        <form>
          <input type="text" placeholder="Email hoặc số điện thoại" />
        

          <button type="submit" className="btn-login">Tiếp Tục </button>

          <div className="options">
            <label>
              <input type="checkbox" /> Zalo OTP
            </label>
             <label>
              <input type="checkbox" /> SMS OTP
            </label>
          </div>

          <div className="links">
            <span>Bạn đã có tài khoản  <a href="/login">Đăng nhập</a>
</span><br />
          </div>
        </form>

        <div className="divider">Hoặc đăng nhập bằng</div>

        <div className="social-login">
          <button className="facebook-btn">Facebook</button>
          <button className="google-btn">Google</button>
        </div>
      </div>

      <div className="login-right">
      </div>
    </div>
  );
};

export default LoginPage;
