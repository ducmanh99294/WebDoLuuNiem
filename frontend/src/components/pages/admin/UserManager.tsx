import { useEffect, useState } from "react";

const UserManagement = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);

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

  return (
    <div className="sp-section">
      <h2>Quản lý người dùng</h2>

      {editingUser ? (
        <div className="edit-product-form">
          <h2 className="form-title">Sửa người dùng</h2>
          {/* Bạn có thể thêm form sửa người dùng ở đây */}
          <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Hủy</button>
        </div>
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
