import React from 'react';
import '../assets/css/Footer.css';
import { SiTiktok, } from 'react-icons/si';
import { FaFacebookF,FaYoutube } from 'react-icons/fa';  // Font Awesome

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Thông tin liên hệ */}
        <div className="footer-column">
          <h4 className="footer-title">tên web</h4>
          <ul>
            <li>📍 Address: 33 xô viết nghệ tĩnh, phường hoà cường nam, thành phố Đà Nẵng</li>
            <li>📞 sđt: 0909876266</li>
            <li>✉️ Email: h1@gmail.com</li>
          </ul>
        </div>

        {/* Cột 2: Chính sách cửa hàng */}
        <div className="footer-column">
          <h4 className="footer-title">chính sách cửa hàng</h4>
          <div className="footer-box" />
        </div>

        {/* Cột 3: Đăng kí nhận tin */}
        <div className="footer-column">
          <h4 className="footer-title">đăng kí nhận tin</h4>
          <div className="footer-box" />
        </div>

        {/* Cột 4: App + Thanh toán */}
        <div className="footer-column">
          <h4 className="footer-title dark">Install App</h4>
          <p>From App Store or Google Play</p>
          <div className="app-icons">
            <img src="/images/appstore.png" alt="App Store" />
            <img src="/images/google-play.png" alt="Google Play" />
          </div>
          <p>Secured Payment Gateways</p>
          <div className="payment-icons">
            <img src="/images/visa.png" alt="Visa" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 by Ecom</p>
        <p>hẹejejeee</p>
        <div className="footer-social">
          <span>Follow Us</span>
          <SiTiktok className="social-icon tiktok" />
          <FaFacebookF className="social-icon" />
          <FaYoutube  className="social-icon" />
        </div>
        <p className="discount-note"> 15% discount on your first</p>
      </div>
    </footer>
  );
};

export default Footer;
