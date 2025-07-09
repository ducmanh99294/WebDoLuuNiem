import React, { useEffect, useState } from 'react';
import '../../assets/css/user.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  role: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  update_at: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

 useEffect(() => {
  axios.get('http://localhost:3000/api/v1/users')
    .then((res) => {
      let allUsers: User[] = [];

      if (Array.isArray(res.data)) {
        allUsers = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        allUsers = res.data.data;
      } else {
        console.error('API không trả về mảng user');
        return;
      }

      //  Lọc chỉ giữ user có role là "user"
      const filteredUsers = allUsers.filter(user => user.role === "user");
      setUsers(filteredUsers);
    })
    .catch((err) => {
      console.error('Lỗi khi gọi API:', err);
    });
}, []);


  return (
    <div className="user-container">
        <h2 className='box-t'> Quản lí người dùng</h2>
        <div className="t1">
            
<button className="title" onClick={() => navigate('/dashboard')}>
  Back
</button>
      <button className='HI'> thêm người dùng </button></div>
      {users.map((user) => (
            
        <div key={user._id} className="user-card">
          <div className="user-info">
            <img src={user.image} alt="avatar" className="user-avatar" />
            <div className="user-details">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>SĐT:</strong> {user.phone}</p>
              <p><strong>Vai trò:</strong> {user.role}</p>
              <p><strong>Địa chỉ:</strong> {user.address}</p>
            </div>
          </div>
          <div className="user-actions">
            <button className="btn edit">Sửa</button>
            <button className="btn delete">Xoá</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
