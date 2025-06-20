import React, { useEffect, useState } from 'react';
import '../../assets/css/profile.css';
import axios from 'axios';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // 👈 Lưu userId khi login

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         console.log('📥 Kết quả trả về từ API /users:', res.data);
        const allUsers = res.data.data;
        
        // Tìm đúng user đang đăng nhập dựa trên ID
        const currentUser = allUsers.find((u: any) => u._id === userId);

        console.log('User đang đăng nhập:', currentUser);
        setUserData(currentUser);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    if (token && userId) {
      fetchUserData();
    }
  }, [token, userId]);

  return (
    <div className="account-settings-container">
      <div className="sidebar">
        <ul>
          <li>Tổng quan</li>
          <li className="active">Đơn hàng</li>
          <li>Đánh giá</li>
          <li>Tải xuống</li>
          <li>Yêu cầu hoàn hàng</li>
          <li>Địa chỉ</li>
          <li className="highlight">Cài đặt tài khoản</li>
          <li>Trở thành người bán hàng</li>
          <li>Đăng xuất</li>
        </ul>
      </div>

      <div className="content">
        <div className="section">
          <h3 className="section-title blue">Hồ sơ người dùng</h3>
          <p className="section-desc">Thông tin cá nhân và email của bạn.</p>

          {userData ? (
            <form className="form">
              <label>Họ và tên</label>
              <input type="text" value={userData.name|| ''} disabled />
              <label>Email</label>
              <input type="email" value={userData.email || ''} disabled />

              <label>Điện thoại</label>
              <input type="tel" value={userData.phone || ''} disabled />

              <label>Địa chỉ</label>
              <input type="text" value={userData.address || ''} disabled />
              <button type="submit" className="btn green">Sửa thông tin </button>
            </form>
          ) : (
            <p>Đang tải thông tin...</p>
          )}
        </div>

        <div className="section">
          <h3 className="section-title orange">Đổi mật khẩu</h3>
          <p className="section-desc">Hãy sử dụng mật khẩu mạnh để đảm bảo an toàn.</p>
          <form className="form">
            <label>Mật khẩu hiện tại *</label>
            <div className="password-input">
              <input type="password" placeholder="Mật khẩu hiện tại"  />
              <span className="eye"></span>
            </div>

            <label>Mật khẩu mới *</label>
            <div className="password-input">
              <input type="password" placeholder="Mật khẩu mới"  />
              <span className="eye"></span>
            </div>

            <label>Xác nhận mật khẩu *</label>
            <div className="password-input">
              <input type="password" placeholder="Xác nhận mật khẩu"  />
              <span className="eye"></span>
            </div>

            <button type="submit" className="btn green" disabled>Đổi mật khẩu</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
