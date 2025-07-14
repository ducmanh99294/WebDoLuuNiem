import React, { useEffect, useState } from "react";

const CategoryManagement = () => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/v1/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
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

  // Mở form thêm mới
  const handleAddClick = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowForm(true);
  };

  // Mở form sửa
  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowForm(true);
  };

  // Đóng form
  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  // Xử lý lưu (thêm hoặc cập nhật)
  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    try {
      if (editingCategory) {
        // Cập nhật danh mục
        const response = await fetch(
          `http://localhost:3000/api/v1/categories/${editingCategory._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: categoryName }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Cập nhật danh mục thành công!");
          setCategoryList((prev) =>
            prev.map((cat) => (cat._id === editingCategory._id ? data.data : cat))
          );
          handleCancel();
        } else {
          alert("Cập nhật danh mục thất bại: " + (data.message || "Lỗi không xác định"));
        }
      } else {
        // Thêm danh mục mới
        const response = await fetch("http://localhost:3000/api/v1/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: categoryName }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Thêm danh mục thành công!");
          setCategoryList((prev) => [...prev, data.data]);
          handleCancel();
        } else {
          alert("Thêm danh mục thất bại: " + (data.message || "Lỗi không xác định"));
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      alert("Đã xảy ra lỗi khi lưu danh mục");
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (categoryId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Đã xóa danh mục thành công!");
        setCategoryList((prev) => prev.filter((cat) => cat._id !== categoryId));
      } else {
        alert("Xóa danh mục thất bại: " + (data.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      alert("Đã xảy ra lỗi khi xóa danh mục");
    }
  };

  return (
    <div className="sp-section">
      <h2>Quản lý danh mục</h2>

      {!showForm && (
        <div className="add0">
          <button className="add" onClick={handleAddClick}>
            +
          </button>
        </div>
      )}

      {showForm && (
        <div className="edit-product-form">
          <h2 className="form-title">{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</h2>
          <div className="form-group">
            <label>Tên danh mục:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục"
            />
          </div>
          <div className="form-actions1">
            <button className="btn btn-success" onClick={handleSave}>
              {editingCategory ? "Cập nhật" : "Thêm"}
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="sp-list">
        {categoryList.length === 0 ? (
          <p>Không có danh mục nào.</p>
        ) : (
          categoryList.map((category) => (
            <div key={category._id} className="sp-card">
              <div className="sp-info">
                  <img
                    src={category.image || '/images/default.jpg'}
                    alt={category.name}
                    className="image"
                    style={{width: 168, height:168}}
                  />
                  <div className="sp-content">
                    <h3 className="sp-name">{category.name}</h3>
                    <p><strong>Mô tả:</strong> {category.description || 'Không có mô tả'}</p>
                  </div>
                </div>
              <div className="sp-actions">
                <button className="sp-btn-edit" onClick={() => handleEditCategory(category)}>
                  Sửa
                </button>
                <button
                  className="sp-btn-delete"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
