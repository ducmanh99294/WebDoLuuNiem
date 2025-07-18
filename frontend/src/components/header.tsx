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
  const [loading,setLoading] = useState(true);
  const [categories, setCategories] = useState<any>([]);

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
    const res = await fetch('http://localhost:3001/api/v1/auth/logout', {
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
      const res = await fetch('http://localhost:3001/api/v1/notifications', {
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

useEffect(() => {
  const fetchCategories = async ()=> {
    try {
      const res = await fetch('http://localhost:3001/api/v1/categories', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data)
    if(data.success) {
      setCategories(data.data);
    }
    } catch (err) {
      console.error('ERR: ', err);
    } finally {
      setLoading(false);
    }
  }
  if (categories) fetchCategories();
}, [])

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
        <div className="utilities">
          <a href="/about">Giới thiệu</a>
          
          {/* Dropdown danh mục */}
          <div 
            className="category-dropdown"
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <button>
              Danh mục
            </button>
            <div className="dropdown-content">
              {categories.map((cat: any) => (
                <div
                  key={cat._id}
                  className="dropdown-item"
                  style={{ padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    localStorage.setItem('categoryId', cat._id);
                    navigate(`/category/${cat._id}`);
                  }}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
          <a href="/newpage">Tin Tức</a>
          <a href="/contact">Liên Hệ </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
