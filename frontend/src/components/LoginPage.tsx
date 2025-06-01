// src/pages/LoginPage.tsx
import React from 'react';
import '../assets/css/Login.css';
import { Link } from 'react-router-dom'; // dùng Link để chuyển trang

const LoginPage: React.FC = () => {
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

        <form>
          <input type="text" placeholder="Email hoặc số điện thoại" />
          <input type="password" placeholder="Mật khẩu" />
          <div className="otp-link">
            <a href="#">Đăng nhập bằng OTP</a>
          </div>

          <button type="submit" className="btn-login">Đăng nhập</button>

          <div className="options">
           <label style={{ width:'100px'  }}>
              <input type="checkbox" /> Nhớ đến tôi
            </label>
          </div>

          <div className="links">
           <span>Bạn không có tài khoản? 

            <a href="/register">Đăng ký</a></span><br />
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
      </div>
    </div>
  );
};

export default LoginPage;
