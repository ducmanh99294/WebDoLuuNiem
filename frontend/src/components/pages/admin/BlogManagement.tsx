import React, { useEffect, useState } from "react";

const BlogManagement = () => {
  const [blogList, setBlogList] = useState<any[]>([]);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [addingBlog, setAddingBlog] = useState<any | null>(null);

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
const handleUpdateBlog = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Bạn cần đăng nhập với quyền Admin");
    return;
  }

  // Kiểm tra các trường bắt buộc
  const { title, content, image, description } = editingBlog || {};
  if (!title || !content || !image || !description) {
    alert("Vui lòng điền đầy đủ các trường: tiêu đề, nội dung, mô tả và hình ảnh");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/v1/blogs/${editingBlog._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
        image,
        description,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Cập nhật bài viết thành công!");
      setBlogList(prev =>
        prev.map(blog => blog._id === editingBlog._id ? data.data : blog)
      );
      setEditingBlog(null);
    } else {
      alert("Lỗi khi cập nhật: " + (data.message || "Không xác định"));
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    alert("Đã xảy ra lỗi khi cập nhật bài viết.");
  }
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
            <button className="btn btn-success"  onClick={handleUpdateBlog} >
              Cập nhật bài viết
            </button>
            <button className="btn btn-secondary" onClick={() => setEditingBlog(null)}>
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
        {addingBlog && (
  <div className="edit-product-form">
    <h2 className="form-title">Thêm bài viết mới</h2>

    <div className="form-group">
      <label>Tiêu đề:</label>
      <input
        type="text"
        value={addingBlog.title}
        onChange={(e) => setAddingBlog({ ...addingBlog, title: e.target.value })}
        placeholder="Nhập tiêu đề"
      />
    </div>

    <div className="form-group">
      <label>Nội dung:</label>
      <textarea
        value={addingBlog.content}
        onChange={(e) => setAddingBlog({ ...addingBlog, content: e.target.value })}
        placeholder="Nhập nội dung"
      />
    </div>

    <div className="form-group">
      <label>Mô tả:</label>
      <textarea
        value={addingBlog.description}
        onChange={(e) => setAddingBlog({ ...addingBlog, description: e.target.value })}
        placeholder="Nhập mô tả"
      />
    </div>

    <div className="form-group">
      <label>Hình ảnh (link):</label>
      <input
        type="text"
        value={addingBlog.image?.[0] || ''}
        onChange={(e) => setAddingBlog({ ...addingBlog, image: [e.target.value] })}
        placeholder="Link hình ảnh"
      />
    </div>

    <div className="form-actions1">
      <button className="btn btn-success" onClick={async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("Bạn cần đăng nhập với quyền Admin");
          return;
        }

        try {
          const response = await fetch('http://localhost:3000/api/v1/blogs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(addingBlog),
          });

          const data = await response.json();

          if (response.ok) {
            alert("Thêm bài viết thành công!");
            setBlogList(prev => [data.data, ...prev]); // cập nhật vào danh sách
            setAddingBlog(null); // đóng form
          } else {
            alert("Lỗi khi thêm: " + (data.message || 'Không xác định'));
          }
        } catch (err) {
          console.error("Lỗi khi thêm:", err);
          alert("Đã xảy ra lỗi khi thêm bài viết.");
        }
      }}>
        Thêm bài viết
      </button>

      <button className="btn btn-secondary" onClick={() => setAddingBlog(null)}>Hủy</button>
    </div>
  </div>
)}

          <div className="add0">
<button className="add" onClick={() => setAddingBlog({ title: '', content: '', description: '', image: [''] })}>+</button>
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
