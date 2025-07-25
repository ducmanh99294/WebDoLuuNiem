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
          <h4 className="footer-title">Cửa hàng đặc sản</h4>
          <ul>
            <li>📍 Address: 33 xô viết nghệ tĩnh, phường Hoà cường nam, thành phố Đà Nẵng</li>
            <li>📞 sđt: 0909876266</li>
            <li>✉️ Email: h1@gmail.com</li>
          </ul>
        </div>

        {/* Cột 2: Chính sách cửa hàng */}
        <div className="footer-column">
          <h4 className="footer-title">Chính sách cửa hàng</h4>
          <ul>
            <li>Chính sách đổi/trả hàng </li>
            <li>Chính sách bảo hành </li>
            <li>Chính sách bảo mật thông tin </li>
            <li>Chính sách vận chuyển </li>
            <li>Chính sách thanh toán </li>
            <li>Vận chuyển & giao hàng </li>
          </ul>
          <div className="footer-box" />
        </div>

        {/* Cột 3: Đăng kí nhận tin */}
        <div className="footer-column">
          <h4 className="footer-title">Đăng kí nhận tin</h4>
          <ul>
            {/* <li>Nhận thông tin mới nhất về sản phẩm và ưu đãi</li>
            <li>Email</li>
            <li>Google</li>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>Tiktok</li> */}
              {/* <li>Nhận thông tin mới nhất về sản phẩm và ưu đãi</li>
              <li><a href="mailto:yourstore@example.com" target="_blank" >Email</a></li>
              <li><a href="https://www.google.com/search?q=Your+Store+Name" target="_blank">Google</a></li>
              <li><a href="https://www.facebook.com/yourstorepage" target="_blank">Facebook</a></li>
              <li><a href="https://twitter.com/yourstorehandle" target="_blank">Twitter</a></li>
              <li><a href="https://www.instagram.com/yourstorehandle" target="_blank">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@yourstorehandle" target="_blank">Tiktok</a></li>
               */}
            <ul>
              <li>Nhận thông tin mới nhất về sản phẩm và ưu đãi</li>
              <li>
                <a href="mailto:yourstore@example.com" target="_blank" style={{ color: 'black', textDecoration: 'none' }}>Email</a>
              </li>
              <li>
                <a href="https://www.google.com/search?q=Your+Store+Name" target="_blank" style={{ color: 'black', textDecoration: 'none' }}>Google</a>
              </li>
              <li>
                <a href="https://www.facebook.com/yourstorepage" target="_blank" style={{ color: 'black', textDecoration: 'none' }}>Facebook</a>
              </li>
              <li>
                <a href="https://twitter.com/yourstorehandle" target="_blank" style={{ color: 'black', textDecoration: 'none' }}>Twitter</a>
              </li>
              <li>
                <a href="https://www.instagram.com/yourstorehandle" target="_blank" style={{ color: 'black', textDecoration: 'none' }}>Instagram</a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@yourstorehandle" target="_blank" style={{ color: 'black', textDecoration: 'none' }}>Tiktok</a>
              </li>
            </ul>
          </ul>
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
