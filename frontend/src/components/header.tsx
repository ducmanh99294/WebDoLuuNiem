import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/header.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaBell, FaShoppingCart, FaUser, FaBars, FaTruck } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username'); // thêm dòng này
  const avatar = localStorage.getItem('avatar') || '/images/default-avatar.png';
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
// hàm tìm kiếm 
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchText.trim()) {
    navigate(`/search?keyword=${encodeURIComponent(searchText.trim())}`);
  }
};
  // hàm đăng xuất 
const handleLogout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    localStorage.removeItem('token');
    navigate('/login');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/v1/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    

    if (data.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } else {
      console.error('Logout API lỗi:', data.message);
      alert(`Logout thất bại: ${data.message}`);
    }
  } catch (error) {
    console.error('Lỗi gọi API logout:', error);
    alert('Lỗi khi gọi API logout, vui lòng thử lại.');
  }
};
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-container">
      {/* Dòng trên */}
      <div className="header-top">
        <div className="box-moi">
          <div className="logo">
            <a href="/"><img src="/images/logo.png" alt="" /></a>
          </div>
          <div className="search-box">
            <input type="text" placeholder="Nhập nội dung tìm kiếm" />
            <button><FaSearch /></button>
          </div>
        </div>

        <div className="header-actions">
          <button><FaTruck /> Theo dõi đơn hàng</button>
          <button><FaBell /> Thông báo</button>

          {/* Nếu có token thì ẩn Đăng nhập/Đăng ký, hiện dropdown tên */}
          {token ? (
            <div className="user-dropdown" ref={dropdownRef}>
      <div className="user-name" onClick={() => setDropdownOpen(!isDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  <img src={avatar} alt="avatar" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
  <span>{username || 'Người dùng'} ▼</span>
</div>


              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile">Tài Khoản</Link>
                  <Link to="/orders">Đơn hàng</Link>
                  <div onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button><FaUser /> Đăng kí</button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button><FaUser /> Đăng nhập</button>
              </Link>
            </>
          )}

          <Link to="/cart"><button><FaShoppingCart /></button></Link>
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
        </div>
      </div>
    </div>
  );
};

export default Header;
