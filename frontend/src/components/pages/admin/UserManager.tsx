import { useEffect, useState } from "react";
import '../../../assets/css/usermana.css'
const UserManagement = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/api/v1/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data.data)) {
          const users = data.data.filter((user: any) => user.role !== "admin");
          setUserList(users);
        } else {
          setUserList([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      }
    };

    fetchUserList();
  }, []);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      address: user.address || ''
    });
  };

  const handleDeleteUser = async (userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập với quyền Admin');
      return;
    }

    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        alert('Đã xóa người dùng thành công!');
        setUserList(prevList => prevList.filter(user => user._id !== userId));
      } else {
        alert('Xóa người dùng thất bại: ' + (data.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert('Đã xảy ra lỗi khi xóa người dùng.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    if (!editingUser) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Bạn cần đăng nhập với quyền Admin");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cập nhật người dùng thành công!");
        setUserList(prevList =>
          prevList.map(user => (user._id === editingUser._id ? { ...user, ...formData } : user))
        );
        setEditingUser(null);
      } else {
        alert("Cập nhật thất bại: " + (data.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Đã xảy ra lỗi khi cập nhật người dùng.");
    }
  };

  return (
    <div className="sp-section">
      <h2>Quản lý người dùng</h2>

      {editingUser ? (
        <div className="edit-product-form">
          <h2 className="form-title">Sửa người dùng</h2>
          <div className="form-group">
            <label>Tên</label>
            <input name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>SĐT</label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Vai trò</label>
            <select name="role" value={formData.role} onChange={handleInputChange}>
  <option value="user">user</option>
  <option value="admin">admin</option>  {/* sửa từ staff thành admin */}
</select>

          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input name="address" value={formData.address} onChange={handleInputChange} />
          </div>
          <div className="bt">
          <button className="btn btn-green" onClick={handleSubmitEdit}>Lưu</button>
          <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Hủy</button>
        </div></div>
      ) : (
        <>
          {userList.length === 0 ? (
            <p>Không có người dùng nào.</p>
          ) : (
            <div className="sp-list">
              {userList.map(user => (
                <div key={user._id} className="sp-card">
                  <div className="sp-info">
                    <img
                      src={user.avatar || "/images/default-avatar.png"}
                      alt="avatar"
                      className="image"
                      style={{ width: 168, height: 168, borderRadius: 8 }}
                    />
                    <div className="sp-content">
                      <h3 className="sp-name">{user.name}</h3>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>SĐT:</strong> {user.phone || 'Không có'}</p>
                      <p><strong>Vai trò:</strong> {user.role}</p>
                      <p><strong>Địa chỉ:</strong> {user.address || 'Không có'}</p>
                    </div>
                  </div>
                  <div className="sp-actions">
                    <button className="sp-btn-edit" onClick={() => handleEditUser(user)}>Sửa</button>
                    <button className="sp-btn-delete" onClick={() => handleDeleteUser(user._id)}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;
