import React from 'react';
import '../assets/css/header.css';
import { FaSearch, FaBell, FaShoppingCart, FaUser, FaBars, FaTruck} from 'react-icons/fa';
import { Link } from 'react-router-dom'; // dùng Link để chuyển trang
const Header: React.FC = () => {
  return (
    <div className="header-container">
      {/* Dòng trên */}
      <div className="header-top">
        <div className='box-moi'>
        <div className="logo"> <a href="/"><img src="/images/logo.png" alt="" /></a></div>
        <div className="search-box">
          <input type="text" placeholder="Nhập nội dung tìm kiếm" />
          <button><FaSearch /></button>
        </div>
         </div>
        <div className="header-actions">
          <button><FaTruck /> Theo dõi đơn hàng</button>
          <button><FaBell /> Thông báo</button>
          <Link to = "/register"style={{ textDecoration: 'none' }}><button><FaUser /> Đăng kí </button></Link>
          <Link to ="/login" style={{ textDecoration: 'none' }} ><button><FaUser /> Đăng nhập</button></Link>

          <button><FaShoppingCart /></button>
        </div>
      </div>

      {/* Dòng dưới */}
      <div className="header-dm">
        <button><FaBars /> DANH MỤC SẢN PHẨM</button>
        <div className="utilities">
        <a href="/about">Giới thiệu</a>
        <a href="#">Đặc Sản </a>
        <a href="#">Trà - Cafe</a>
        <a href="/newpage">Tin Tức</a>
        <a href="/contact">Liên Hệ </a>
        <a href="#">Tên</a>
      </div>
    </div>
    </div>
  );
};

export default Header;
