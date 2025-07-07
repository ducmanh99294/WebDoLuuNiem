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
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading,setLoading] = useState(true)

  const navigate = useNavigate();
// hàm tìm kiếm 
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchText.trim()) {
    navigate(`/search?keyword=${encodeURIComponent(searchText.trim())}`);
  }
};
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // lấy thông tin người dùng từ localStorage
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
      setShowNotification(false); // 👈 Thêm dòng này để ẩn popup thông báo
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/v1/notifications', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data)
    if(data.success) {
      setNotifications(data.data || []);
      }
    } catch (err) {
        console.error('err', err);
    } finally {
      setLoading(false);
    }
  }

  if (showNotification) fetchNotifications();
}, [showNotification])


  return (
    <div className="header-container">
      {/* Dòng trên */}
      <div className="header-top">
        <div className="box-moi">
          <div className="logo">
            <a href="/"><img src="/images/logo.png" alt="" /></a>
          </div>
<div className="search-box">
  <input
    type="text"
    placeholder="Nhập nội dung tìm kiếm"
    value={searchText || ''} // đảm bảo luôn là chuỗi
    onChange={(e) => setSearchText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleSearch(e);
      }
    }}
  />
  <button onClick={handleSearch}><FaSearch /></button>
</div>


        </div>

        <div className="header-actions">
   <div
  className="notification-wrapper"
  style={{ position: 'relative' }}
  ref={dropdownRef}
>
  <button onClick={() => setShowNotification(!showNotification)}>
    <FaBell /> Thông báo
  </button>

  {showNotification && (
  <div className="notification-popup1">
    <h5 className="title">Thông báo</h5>
    {loading ? (
      <p>Đang tải...</p>
    ) : notifications.length === 0 ? (
      <p>Không có thông báo mới.</p>
    ) : (
      notifications.map((noti) => (
        <div key={noti._id} className="noti-item">
          <div>{noti.message}</div>
          <div style={{ fontSize: 12, color: '#888' }}>
            {new Date(noti.created_at || noti.createdAt).toLocaleString()}
          </div>
        </div>
      ))
    )}
  </div>
)}
</div>


<Link to={'/order'} style={{ textDecoration: 'none'}}><button><FaTruck/> Theo dõi đơn hàng</button></Link>


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

          <Link to="/cart"><button><FaShoppingCart/></button></Link>
        
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
