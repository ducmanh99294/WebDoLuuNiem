import React, { useEffect, useState } from "react";
import { useAutoRefreshToken } from "../../refreshAccessToken";
import { FaPlus } from "react-icons/fa";
import {CreateProductSuccess, DeleteProductSuccess, UpdateProductSuccess, ConfirmDeleteDialog} from '../../PaymentSuccess';

const CategoryManagement = () => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [addingCategory, setAddingCategory] = useState<any | null>(null);
  const [image, setImage] = useState<null | { file?: File; url?: string }>(null);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/v1/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data)
        if (Array.isArray(data.data)) {
          setCategoryList(data.data);
        } else {
          setCategoryList([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách danh mục:", error);
      }
    };

    fetchCategoryList();
  }, []);

    // Mở form sửa bài viết
  const handleEditCategory = (category: any) => {
    setEditingCategory({ ...category});
    const imageUrls = category.image?.map((img: any) => img) || [];
    setImage(imageUrls);
  };

  // xử lí xóa ảnh 
  const handleRemoveImage = () => {
    setImage(null);
  };

    // xử lí thêm ảnh từ  link 
  const handleAddImageLink = () => {
    const link = prompt("Nhập link hình ảnh:");
    if (link) {
      setImage({ url: link });

      if (addingCategory) {
        setAddingCategory((prev: any)  => ({ ...prev, image: link }));
      } else if (editingCategory) {
        setEditingCategory((prev: any)  => ({ ...prev, image: link }));
      }
    }
  };

  // xử lí thêm ảnh từ  folder 
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setImage({ file, url: previewUrl });

      if (addingCategory) {
        setAddingCategory((prev: any) => ({ ...prev, image: previewUrl }));
      } else if (editingCategory) {
        setEditingCategory((prev: any) => ({ ...prev, image: previewUrl }));
      }
    }
  };

    // hàm mở form thêm sản phẩm 
  const handleAddCategory = () => {
    setAddingCategory({
      name: '',
      description: '',
      image: '',
    });
    setImage(null);  

  };

  // hàm lưu chỉnh sửa 
  const handleUpdateProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token || !editingCategory) {
      alert('Bạn cần đăng nhập hoặc có danh mục để sửa');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editingCategory.name || '');
      formData.append('description', editingCategory.description || '');


      // ✅ Nếu là link thì gửi imageLink
      if (editingCategory.image && typeof editingCategory.image === 'string') {
        formData.append('image', editingCategory.image);
      }

      // ✅ Nếu là file thì gửi image (file)
      if (editingCategory.image && typeof editingCategory.image !== 'string') {
        formData.append('image', editingCategory.image); // image là File
      }

      const response = await fetch(`http://localhost:3001/api/v1/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
          // ❌ KHÔNG cần Content-Type khi dùng FormData (trình duyệt tự set multipart/form-data)
        },
        body: formData
      });

      const data = await response.json();
      console.log('✅ Kết quả cập nhật:', data);

      if (response.ok) {
        setEditingCategory(null);
        setCategoryList((prevList) =>
          prevList.map((p) =>
            p._id === editingCategory._id ? { ...p, ...data.data } : p
          )
        );
        setShowCreateSuccess(true);
      } else {
        alert('❌ Cập nhật thất bại: ' + (data.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('🚨 Lỗi cập nhật:', error);
      alert('Đã xảy ra lỗi khi cập nhật.');
    }
  };

  const handleSaveNewCategory = async (newCategory: any) => {
    const token = localStorage.getItem('token');
    if (!token || !newCategory) {
      alert('Bạn cần đăng nhập hoặc điền đủ thông tin.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('description', newCategory.description);

      // 👇 Gửi file nếu có
      if (image?.file) {
        formData.append('image', image.file);
      }

      // 👇 Gửi URL nếu có
      if (image?.url && !image.file) {
        formData.append('image', image.url);
      }

      const response = await fetch(`http://localhost:3001/api/v1/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setAddingCategory(null);
        setCategoryList(prev => [...prev, data.data]);
        setShowCreateSuccess(true);
      } else {
        alert('❌ Thêm danh mục thất bại: ' + (data.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('🚨 Lỗi khi thêm danh mục:', error);
      alert('Đã xảy ra lỗi khi thêm danh mục.');
    }
  };

  const confirmDelete = (categoryId: string) => {
  setPendingDelete(categoryId);
  setShowConfirmDelete(true);
};

const handleDeleteCategory = async () => {
  if (!pendingDelete) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn cần đăng nhập");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/api/v1/categories/${pendingDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setCategoryList((prev) => prev.filter((cat) => cat._id !== pendingDelete));
      setShowDeleteSuccess(true);
    } else {
      alert("Xóa danh mục thất bại: " + (data.message || "Lỗi không xác định"));
    }
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    alert("Đã xảy ra lỗi khi xóa danh mục");
  } finally {
    setShowConfirmDelete(false);
    setPendingDelete(null);
  }
};

  return (
    
    <div className="sp-section">
      <h2>Quản lý danh mục</h2>

      {editingCategory ? (
  <div className="edit-product-form">
    <h2 className="form-title">Sửa danh mục</h2>

    <div className="form-group">
      <label>Tiêu đề danh mục:</label>
      <input
        type="text"
        value={editingCategory.name}
        onChange={(e) =>
          setEditingCategory({ ...editingCategory, name: e.target.value })
        }
        placeholder="Nhập tiêu đề danh mục"
      />
    </div>

    <div className="form-group">
      <label>Nội dung:</label>
      <textarea
        value={editingCategory.description}
        onChange={(e) =>
          setEditingCategory({
            ...editingCategory,
            description: e.target.value,
          })
        }
        placeholder="Nhập nội dung"
      />
    </div>

    <div className="form-group">
      <label>Hình ảnh:</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {editingCategory.image && (
          <div style={{ position: "relative" }}>
            <img
              src={ 
                editingCategory.image.startsWith('http') ||
                editingCategory.image.startsWith('blob') ||
                editingCategory.image.startsWith('data:image')
                ? editingCategory.image 
                : `http://localhost:3001${editingCategory.image}`
              }
              alt="Ảnh"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <button
              type="button"
              onClick={() =>
                setEditingCategory({ ...editingCategory, image: null })
              }
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              x
            </button>
          </div>
        )}
      </div>

      {!editingCategory.image && (
        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          <label
            style={{
              cursor: "pointer",
              background: "#eee",
              padding: "6px 12px",
              borderRadius: "4px",
            }}
          >
            + Tải ảnh từ máy
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEditingCategory({
                      ...editingCategory,
                      image: reader.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ display: "none" }}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              const link = prompt("Nhập đường dẫn ảnh:");
              if (link) {
                setEditingCategory({ ...editingCategory, image: link });
              }
            }}
            style={{
              cursor: "pointer",
              background: "#eee",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
            }}
          >
            + Thêm từ link
          </button>
        </div>
      )}
    </div>

    <div className="form-actions1">
      <button className="btn btn-success" onClick={handleUpdateProduct}>
        Sửa danh mục
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => setEditingCategory(null)}
      >
        Hủy
      </button>
    </div>
  </div>
) : 
      addingCategory ? (
  <div className="edit-product-form">
    <h2 className="form-title">thêm danh mục</h2>

    <div className="form-group">
      <label>Tên danh mục:</label>
      <input
        type="text"
        value={addingCategory.name}
        onChange={(e) =>
          setAddingCategory({ ...addingCategory, name: e.target.value })
        }
        placeholder="Nhập tên danh mục"
      />
    </div>

    <div className="form-group">
      <label>Nội dung:</label>
      <textarea
        value={addingCategory.description}
        onChange={(e) =>
          setAddingCategory({ ...addingCategory, description: e.target.value })
        }
        placeholder="Nhập nội dung"
      />
    </div>

        <div className="form-group">
      <label>Hình ảnh:</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {addingCategory.image && (
          <div style={{ position: "relative" }}>
            <img
              src={ addingCategory.image.startsWith('http') ||
                addingCategory.image.startsWith('blob') ||
                addingCategory.image.startsWith('data:image')
                ? addingCategory.image 
                : `http://localhost:3001${addingCategory.image}`}
              alt="Ảnh"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <button
              type="button"
              onClick={() =>
                handleRemoveImage()
              }
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              x
            </button>
          </div>
        )}
      </div>

      {!addingCategory.image && (
        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          <label
            style={{
              cursor: "pointer",
              background: "#eee",
              padding: "6px 12px",
              borderRadius: "4px",
            }}
          >
            + Tải ảnh từ máy
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>

          <button
            type="button"
            onClick={handleAddImageLink}
            style={{
              cursor: "pointer",
              background: "#eee",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
            }}
          >
            + Thêm từ link
          </button>
        </div>
      )}
    </div>

    <div className="form-actions1">
      <button
        className="btn btn-success"
        onClick={() => handleSaveNewCategory(addingCategory)}
      >
        Thêm danh mục
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => setAddingCategory(null)}
      >
        Hủy
      </button>
    </div>
  </div>
) :
      (
        <>
          <div className="add0">
              <button className="add" onClick={handleAddCategory}>
                <FaPlus />
              </button>
            </div>

          {categoryList.map((category) => {
  let imageSrc = '/images/default.jpg';

  if (category.image) {
    if (typeof category.image === 'string') {
      if (category.image.startsWith('http') || category.image.startsWith('data:image')) {
        imageSrc = category.image;
      } else {
        imageSrc = `http://localhost:3001${category.image}`;
      }
    }
  }

  return (
    <div key={category._id} className="sp-card">
      <div className="sp-info">
        <img
          src={imageSrc}
          alt={category.name}
          className="image"
          style={{ width: 168, height: 168, borderRadius: 8 }}
        />
        <div className="sp-content">
          <h3 className="sp-name">{category.name}</h3>
          <p><strong>Mô tả:</strong> {category.description || 'Không có mô tả'}</p>
        </div>
      </div>
      <div className="sp-actions">
        <button className="sp-btn-edit" onClick={() => handleEditCategory(category)}>Sửa</button>
        <button className="sp-btn-delete" onClick={() => confirmDelete(category._id)}>Xóa</button>
      </div>
    </div>
  );
})}

        </>
      )}
{showCreateSuccess && (
  <CreateProductSuccess
    message="Thêm danh mục thành công"
    description="Danh mục mới đã được tạo."
    buttonText="Đóng"
    onClose={() => setShowCreateSuccess(false)}
  />
)}

{showUpdateSuccess && (
  <UpdateProductSuccess
    message="Cập nhật danh mục thành công"
    description="Danh mục đã được chỉnh sửa."
    buttonText="Đóng"
    onClose={() => setShowUpdateSuccess(false)}
  />
)}

{showDeleteSuccess && (
  <DeleteProductSuccess
    message="Xóa danh mục thành công"
    description="Danh mục đã bị xóa khỏi hệ thống."
    buttonText="Đóng"
    onClose={() => setShowDeleteSuccess(false)}
  />
)}
{showConfirmDelete && (
  <ConfirmDeleteDialog
    onConfirm={handleDeleteCategory}
    onCancel={() => {
      setShowConfirmDelete(false);
      setPendingDelete(null);
    }}
  />
)}
    </div>
    
  );
};

export default CategoryManagement;
