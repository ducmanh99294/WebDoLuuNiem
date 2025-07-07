import React, { useEffect, useState } from 'react';
import '../../assets/css/profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<any>({});
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('https://be-webdoluuniem.onrender.com/api/v1/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allUsers = res.data.data;
        const currentUser = allUsers.find((u: any) => u._id === userId);

        // Ép kiểu phone thành string
        const cleanedUser = {
          ...currentUser,
          phone: currentUser.phone ? String(currentUser.phone) : '',
        };

        setUserData(cleanedUser);
        setEditableData(cleanedUser);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    if (token && userId) {
      fetchUserData();
    }
  }, [token, userId]);

  // Khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: String(value) });
  };

  // Khi bấm "Sửa thông tin"
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Lưu thông tin
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Dữ liệu gửi đi:', editableData);
      await axios.put(
        `https://be-webdoluuniem.onrender.com/api/v1/users/${userId}`,
        editableData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(editableData);
      setIsEditing(false);
      alert('Cập nhật thành công!');
    } catch (err: any) {
      console.error('Lỗi cập nhật:', err.response?.data || err.message);
      alert('Có lỗi xảy ra khi cập nhật.');
    }
  };

  return (
    <div className="account-settings-container">
      <div className="sidebar">
        <ul>
          <li>Tổng quan</li>
          <li className="active">Đơn hàng</li>
          <li>Đánh giá</li>
          <li>Tải xuống</li>
          <li>Yêu cầu hoàn hàng</li>
          <li className="highlight">Cài đặt tài khoản</li>
          <li>Trở thành người bán hàng</li>
          <li onClick={handleLogout} className="logout">Đăng xuất</li>
        </ul>
      </div>

      <div className="content">
        <div className="section">
          <h3 className="section-title blue">Hồ sơ người dùng</h3>
          <p className="section-desc">Thông tin cá nhân và email của bạn.</p>

          {userData ? (
            <form className="form" onSubmit={handleSave}>
              <label>Họ và tên</label>
              <input
                type="text"
                name="name"
                value={String(editableData.name || '')}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={String(editableData.email || '')}
                disabled
              />

              <label>Điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={String(editableData.phone || '')}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={String(editableData.address || '')}
                onChange={handleChange}
                disabled={!isEditing}
              />

              {isEditing ? (
                <button type="submit" className="btn green">Lưu</button>
              ) : (
                <button type="button" className="btn green" onClick={handleEditClick}>Sửa thông tin</button>
              )}
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
              <input type="password" placeholder="Mật khẩu hiện tại" />
              <span className="eye"></span>
            </div>

            <label>Mật khẩu mới *</label>
            <div className="password-input">
              <input type="password" placeholder="Mật khẩu mới" />
              <span className="eye"></span>
            </div>

            <label>Xác nhận mật khẩu *</label>
            <div className="password-input">
              <input type="password" placeholder="Xác nhận mật khẩu" />
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
