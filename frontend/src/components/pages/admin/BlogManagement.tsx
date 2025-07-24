import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {CreateProductSuccess, DeleteProductSuccess, UpdateProductSuccess, ConfirmDeleteDialog} from '../../PaymentSuccess';


const BlogManagement = () => {
  const [blogList, setBlogList] = useState<any[]>([]);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [addingBlog, setAddingBlog] = useState<any | null>(null);
  const [image, setImage] = useState<string[]>(['']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);  // ảnh từ máy
  const [imageLinks, setImageLinks] = useState<string[]>([]);  // ảnh từ link
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Lấy danh sách bài viết
  useEffect(() => {
        fetchBlogList();
  }, []);

    const fetchBlogList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/v1/blogs', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data)
        if (Array.isArray(data.data)) {
          setBlogList(data.data);
        } else {
          setBlogList([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết:', error);
      }
    };

  // Mở form sửa bài viết
  const handleEditBlog = (blog: any) => {
    setEditingBlog({ ...blog});
      const imageUrls = blog.image
    ? (Array.isArray(blog.image) ? blog.image : [blog.image])
    : [];
    setImage(imageUrls);
    setImageFiles([]);
    setImageLinks([]);
  };

  // xử lí xóa ảnh 
const handleRemoveImage = (index: number) => {
  setImage(prev => prev.filter((_, i) => i !== index));

  // Loại bỏ link nếu là link
  setImageLinks(prev => prev.filter((_, i) => image[i].startsWith('http') ? i !== index : true));
  
  // Loại bỏ file nếu là file (URL.createObjectURL)
  setImageFiles(prev => prev.filter((_, i) => !image[i].startsWith('blob:') || i !== index));
};

  // xử lí thêm ảnh từ  link 
  const handleAddImageLink = () => {
  if (imageFiles.length + imageLinks.length >= 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }

  const link = prompt('Nhập link hình ảnh:');
  if (link) {
    setImageLinks(prev => [...prev, link]);
    setImage(prev => [...prev, link]);  
  }
};
// xử lí thêm ảnh từ  folder 
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
  
    if (imageFiles.length + imageLinks.length + files.length > 5) {
      alert('Chỉ được chọn tối đa 5 ảnh.');
      return;
    }
  
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
  
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImage(prev => [...prev, ...newPreviews]);
  };

  // hàm mở form thêm sản phẩm 
const handleAddBlog = () => {
  setAddingBlog({
    title: '',
    description: '',
    content: '',
    image: [],
  });
  setImage([]);  
  setImageFiles([]);  
  setImageLinks([]); 
};

// hàm lưu chỉnh sửa 
const handleUpdateProduct = async () => {
  const token = localStorage.getItem('token');
  if (!token || !editingBlog) {
    alert('Bạn cần đăng nhập hoặc có sản phẩm để sửa');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', editingBlog.title);
    formData.append('content', editingBlog.content);
    formData.append('description', editingBlog.description);

    // ✅ Gửi ảnh dạng link (string)
       imageFiles.forEach((file) => {
        formData.append('image', file);
      });

       imageLinks.forEach((url) => {
        formData.append('image', url); // Backend sẽ xử lý chuỗi URL
      });

    const response = await fetch(`http://localhost:3001/api/v1/blogs/${editingBlog._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    console.log('✅ Kết quả cập nhật:', data);

    if (response.ok) {
      setEditingBlog(null);
      setBlogList((prevList) =>
        prevList.map((p) =>
          p._id === editingBlog._id ? { ...p, ...editingBlog } : p
        )
      );
      setShowUpdateSuccess(true);
      await fetchBlogList();
    } else {
      alert('❌ Cập nhật thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('🚨 Lỗi cập nhật:', error);
    alert('Đã xảy ra lỗi khi cập nhật.');
  }
};

const handleSaveNewBlog = async (newBlog: any) => {
  const token = localStorage.getItem('token');
  if (!token || !newBlog) {
    alert('Bạn cần đăng nhập hoặc điền đủ thông tin.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', newBlog.title);
    formData.append('description', newBlog.description);
    formData.append('content', newBlog.content);


    // 👇 Gửi file từ máy (blob)
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    // 👇 Gửi link (ảnh từ URL)
    imageLinks.forEach((url) => {
      formData.append('image', url); // Backend sẽ xử lý chuỗi URL
    });

    const response = await fetch(`http://localhost:3001/api/v1/blogs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (response.ok) {
      setAddingBlog(null);
      setBlogList(prev => [...prev, data.data]);
      setShowCreateSuccess(true);
      await fetchBlogList();
    } else {
      alert('❌ Thêm sản phẩm thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('🚨 Lỗi khi thêm sản phẩm:', error);
    alert('Đã xảy ra lỗi khi thêm sản phẩm.');
  }
};

  const confirmDelete = (blogId: string) => {
  setPendingDelete(blogId);
  setShowConfirmDelete(true);
};
  // Xóa bài viết
  const handleDeleteBlog = async () => {
      if (!pendingDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập với quyền Admin');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/v1/blogs/${pendingDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setBlogList(prevList => prevList.filter(blog => blog._id !== pendingDelete));
        setShowDeleteSuccess(true);
      } else {
        alert('Xóa bài viết thất bại: ' + (data.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      alert('Đã xảy ra lỗi khi xóa bài viết.');
    } finally {
    setShowConfirmDelete(false);
    setPendingDelete(null);
  }
  };

  return (
    <div className="sp-section">
      <h2>Quản lý bài viết</h2>

      {editingBlog ? (
        <div className="edit-product-form">
        <h2 className="form-title">Sửa bài viết</h2>

        <div className="form-group">
          <label>tiêu đề bài viết:</label>
          <input
            type="text"
            value={editingBlog.title}
            onChange={(e) =>
              setEditingBlog({ ...editingBlog, title: e.target.value })
            }
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div className="form-group">
          <label>nội dung:</label>
          <textarea
            value={editingBlog.description}
            onChange={(e) =>
              setEditingBlog({ ...editingBlog, description: e.target.value })
            }
            placeholder="Nhập nội dung"
          />
        </div>

        <div className="form-group">
          <label>content:</label>
          <input
            type="text"
            value={editingBlog.content}
            onChange={(e) =>
              setEditingBlog({ ...editingBlog, content: e.target.value })
            }
            placeholder="Nhập content"
          />
        </div>

<div className="form-group">
  <label>Hình ảnh:</label>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {image.map((img, index) => (
      <div key={index} style={{ position: 'relative' }}>
      <img
         src={
    img.startsWith('http') ||
    img.startsWith('blob') ||
    img.startsWith('data:image')
      ? img
      : `http://localhost:3001${img}`
  }        alt={`Ảnh ${index + 1}`}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
      />

        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
          }}
        >
          x
        </button>
      </div>
    ))}
  </div>

  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
  {image.length < 100 && (
    <>
      <label
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
        }}
      >
        + Tải ảnh từ máy
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>

      <button
        type="button"
        onClick={handleAddImageLink}
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
          border: 'none'
        }}
      >
        + Thêm từ link
      </button>
    </>
  )}
</div>

</div>
        <div className="form-actions1">
          <button className="btn btn-success" onClick={() => handleUpdateProduct()}>
            Sửa bài viết
          </button>
          <button className="btn btn-secondary" onClick={() => setEditingBlog(null)}>
            Hủy
          </button>
        </div>
      </div>
      ) 
       :  
      addingBlog ? (
      <div className="edit-product-form">
        <h2 className="form-title">Thêm bài viết</h2>

        <div className="form-group">
          <label>Tên tiêu đề:</label>
          <input
            type="text"
            value={addingBlog.title}
            onChange={(e) =>
              setAddingBlog({ ...addingBlog, title: e.target.value })
            }
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div className="form-group">
          <label>nội dung:</label>
          <textarea
            value={addingBlog.description}
            onChange={(e) =>
              setAddingBlog({ ...addingBlog, description: e.target.value })
            }
        
            placeholder="Nhập nội dung"
          />
        </div>

        <div className="form-group">
          <label>content:</label>
          <input
            type="text"
            value={addingBlog.content}
            onChange={(e) =>
              setAddingBlog({ ...addingBlog, content: e.target.value })
            }
            placeholder="Nhập content"
          />
        </div>

<div className="form-group">
  <label>Hình ảnh:</label>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {image.map((img, index) => (
      <div key={index} style={{ position: 'relative' }}>
        <img
          src={img}
          alt={`Ảnh ${index + 1}`}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
          }}
        >
          x
        </button>
      </div>
    ))}
  </div>

  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
  {image.length < 100 && (
    <>
      <label
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
        }}
      >
        + Tải ảnh từ máy
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>

      <button
        type="button"
        onClick={handleAddImageLink}
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
          border: 'none'
        }}
      >
        + Thêm từ link
      </button>
    </>
  )}
</div>

</div>



        <div className="form-actions1">
          <button className="btn btn-success" onClick={() => handleSaveNewBlog(addingBlog)}>
            Thêm sản phẩm
          </button>
          <button className="btn btn-secondary" onClick={() => setAddingBlog(null)}>
            Hủy
          </button>
        </div>
      </div>
    ) : (
        <>
          <div className="add0">
              <button className="add" onClick={handleAddBlog}>
                <FaPlus />
              </button>
            </div>

          {blogList.length === 0 ? (
            <p>Không có bài viết nào.</p>
          ) : (
            <div className="sp-list">
              {blogList.map((blog) => {
 let imageSrc = '/images/default.jpg';

  if (Array.isArray(blog.image) && blog.image.length > 0) {
    const firstImage = blog.image[0];

    const rawImage =
      typeof firstImage === 'string'
        ? firstImage
        : typeof firstImage === 'object' && firstImage?.image
        ? firstImage.image
        : null;

    if (typeof rawImage === 'string') {
      if (rawImage.startsWith('http') || rawImage.startsWith('data:image')) {
        imageSrc = rawImage;
      } else {
        imageSrc = `http://localhost:3001${rawImage}`;
      }
    }
  }
  return (
    <div key={blog._id} className="sp-card">
      <div className="sp-info">
        <img
          src={imageSrc}
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
        <button className="sp-btn-delete" onClick={() => confirmDelete(blog._id)}>Xóa</button>
      </div>
    </div>
  );
})}

            </div>
          )}
        </>
      )}
      {showCreateSuccess && (
        <CreateProductSuccess
          message="Thêm bài viết thành công"
          description="bài viết mới đã được tạo."
          buttonText="Đóng"
          onClose={() => setShowCreateSuccess(false)}
        />
      )}
      
      {showUpdateSuccess && (
        <UpdateProductSuccess
          message="Cập nhật bài viết thành công"
          description="bài viết đã được chỉnh sửa."
          buttonText="Đóng"
          onClose={() => setShowUpdateSuccess(false)}
        />
      )}
      
      {showDeleteSuccess && (
        <DeleteProductSuccess
          message="Xóa bài viết thành công"
          description="bài viết đã bị xóa khỏi hệ thống."
          buttonText="Đóng"
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
      {showConfirmDelete && (
        <ConfirmDeleteDialog
          onConfirm={handleDeleteBlog}
          onCancel={() => {
            setShowConfirmDelete(false);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default BlogManagement;
