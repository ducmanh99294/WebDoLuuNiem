import React, { useEffect, useState } from "react";

const BlogManagement = () => {
  const [blogList, setBlogList] = useState<any[]>([]);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  // Lấy danh sách bài viết
  useEffect(() => {
    const fetchBlogList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/blogs', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setBlogList(data.data);
        } else {
          setBlogList([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết:', error);
      }
    };

    fetchBlogList();
  }, []);

  // Mở form sửa bài viết
  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
  };

  // Xóa bài viết
  const handleDeleteBlog = async (blogId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập với quyền Admin');
      return;
    }

    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa bài viết này?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        alert('Đã xóa bài viết thành công!');
        setBlogList(prevList => prevList.filter(blog => blog._id !== blogId));
      } else {
        alert('Xóa bài viết thất bại: ' + (data.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      alert('Đã xảy ra lỗi khi xóa bài viết.');
    }
  };

  return (
    <div className="sp-section">
      <h2>Quản lý bài viết</h2>

      {editingBlog ? (
        <div className="edit-product-form">
          <h2 className="form-title">Sửa bài viết</h2>
          {/* Form sửa bài viết có thể thêm ở đây */}
          <div className="form-group">
            <label>Tiêu đề:</label>
            <input
              type="text"
              value={editingBlog.title || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
              placeholder="Nhập tiêu đề bài viết"
            />
          </div>

          <div className="form-group">
            <label>Nội dung:</label>
            <textarea
              value={editingBlog.content || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
              placeholder="Nhập nội dung bài viết"
            />
          </div>

          <div className="form-group">
            <label>Mô tả:</label>
            <textarea
              value={editingBlog.description || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, description: e.target.value })}
              placeholder="Nhập mô tả bài viết"
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh (link):</label>
            <input
              type="text"
              value={editingBlog.image?.[0] || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, image: [e.target.value] })}
              placeholder="Nhập link hình ảnh"
            />
          </div>

          <div className="form-actions1">
            {/* Bạn cần thêm hàm cập nhật bài viết tương tự handleUpdateProduct */}
            <button className="btn btn-success" /* onClick={handleUpdateBlog} */>
              Cập nhật bài viết
            </button>
            <button className="btn btn-secondary" onClick={() => setEditingBlog(null)}>
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="add0">
            <button className="add">+</button>
          </div>

          {blogList.length === 0 ? (
            <p>Không có bài viết nào.</p>
          ) : (
            <div className="sp-list">
              {blogList.map(blog => (
                <div key={blog._id} className="sp-card">
                  <div className="sp-info">
                    <img
                      src={blog.image?.[0] || '/images/default.jpg'}
                      alt={blog.title}
                      className="image"
                      style={{ width: 168, height: 168, borderRadius: 8 }}
                    />
                    <div className="sp-content">
                      <h3 className="sp-name">{blog.title}</h3>
                      <p><strong>Mô tả:</strong> {blog.description || 'Không có mô tả'}</p>
                      <p><strong>Nội dung:</strong> {blog.content || 'Không có'}</p>
                    </div>
                  </div>
                  <div className="sp-actions">
                    <button className="sp-btn-edit" onClick={() => handleEditBlog(blog)}>Sửa</button>
                    <button className="sp-btn-delete" onClick={() => handleDeleteBlog(blog._id)}>Xóa</button>
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

export default BlogManagement;
