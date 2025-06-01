import React from 'react';
import '../assets/css/header.css';
import { FaSearch, FaBell, FaShoppingCart, FaUser, FaBars, FaTruck} from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <div className="header-container">
      {/* Dòng trên */}
      <div className="header-top">
        <div className='box-moi'>
        <div className="logo" > <img src="/images/logo.png" alt="" srcset="" /></div>
        <div className="search-box">
          <input type="text" placeholder="Nhập nội dung tìm kiếm" />
          <button><FaSearch /></button>
        </div>
         </div>
        <div className="header-actions">
          <button><FaTruck /> Theo dõi đơn hàng</button>
          <button><FaBell /> Thông báo</button>
          <button><FaUser /> Đăng nhập / Đăng ký</button>
          <button><FaShoppingCart /></button>
        </div>
      </div>

      {/* Dòng dưới */}
      <div className="header-bottom">
        <button><FaBars /> DANH MỤC SẢN PHẨM</button>
        <a href="#">Đi chợ online</a>
        <a href="#">Trái cây theo mùa</a>
        <a href="#">Rau củ</a>
        <a href="#">Trà - Cafe</a>
        <a href="#">Đặc sản</a>
        <a href="#">Tên</a>
      </div>
    </div>
  );
};

export default Header;
