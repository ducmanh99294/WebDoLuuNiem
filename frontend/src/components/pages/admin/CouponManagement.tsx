import React, { useEffect, useState } from "react";

const CouponManagement = () => {
  const [couponList, setCouponList] = useState<any[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [couponData, setCouponData] = useState({
    code: "",
    discount: 0,
    expiryDate: "",
  });

  useEffect(() => {
    const fetchCouponList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/v1/coupons", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setCouponList(data.data);
        } else {
          setCouponList([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách mã giảm giá:", error);
      }
    };

    fetchCouponList();
  }, []);

  // Mở form thêm mới
  const handleAddClick = () => {
    setEditingCoupon(null);
    setCouponData({ code: "", discount: 0, expiryDate: "" });
    setShowForm(true);
  };

  // Mở form sửa
  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setCouponData({
      code: coupon.code,
      discount: coupon.discount,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "",
    });
    setShowForm(true);
  };

  // Đóng form
  const handleCancel = () => {
    setShowForm(false);
    setEditingCoupon(null);
    setCouponData({ code: "", discount: 0, expiryDate: "" });
  };

  // Lưu (thêm hoặc cập nhật)
  const handleSave = async () => {
    if (!couponData.code.trim()) {
      alert("Vui lòng nhập mã giảm giá");
      return;
    }
    if (couponData.discount <= 0) {
      alert("Giảm giá phải lớn hơn 0");
      return;
    }
    if (!couponData.expiryDate) {
      alert("Vui lòng chọn ngày hết hạn");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    try {
      if (editingCoupon) {
        // Cập nhật mã giảm giá
        const response = await fetch(
          `http://localhost:3000/api/v1/coupons/${editingCoupon._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(couponData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Cập nhật mã giảm giá thành công!");
          setCouponList((prev) =>
            prev.map((c) => (c._id === editingCoupon._id ? data.data : c))
          );
          handleCancel();
        } else {
          alert("Cập nhật mã giảm giá thất bại: " + (data.message || "Lỗi không xác định"));
        }
      } else {
        // Thêm mới
        const response = await fetch("http://localhost:3000/api/v1/coupons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(couponData),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Thêm mã giảm giá thành công!");
          setCouponList((prev) => [...prev, data.data]);
          handleCancel();
        } else {
          alert("Thêm mã giảm giá thất bại: " + (data.message || "Lỗi không xác định"));
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu mã giảm giá:", error);
      alert("Đã xảy ra lỗi khi lưu mã giảm giá");
    }
  };

  // Xóa mã giảm giá
  const handleDeleteCoupon = async (couponId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Đã xóa mã giảm giá thành công!");
        setCouponList((prev) => prev.filter((c) => c._id !== couponId));
      } else {
        alert("Xóa mã giảm giá thất bại: " + (data.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa mã giảm giá:", error);
      alert("Đã xảy ra lỗi khi xóa mã giảm giá");
    }
  };

  return (
    <div className="sp-section">
      <h2>Quản lý mã giảm giá</h2>

      {!showForm && (
        <div className="add0">
          <button className="add" onClick={handleAddClick}>
            +
          </button>
        </div>
      )}

      {showForm && (
        <div className="edit-product-form">
          <h2 className="form-title">{editingCoupon ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}</h2>
          <div className="form-group">
            <label>Mã giảm giá:</label>
            <input
              type="text"
              value={couponData.code}
              onChange={(e) => setCouponData({ ...couponData, code: e.target.value })}
              placeholder="Nhập mã giảm giá"
            />
          </div>
          <div className="form-group">
            <label>Phần trăm giảm:</label>
            <input
              type="number"
              min={0}
              max={100}
              value={couponData.discount}
              onChange={(e) =>
                setCouponData({ ...couponData, discount: Number(e.target.value) })
              }
              placeholder="Nhập phần trăm giảm"
            />
          </div>
          <div className="form-group">
            <label>Ngày hết hạn:</label>
            <input
              type="date"
              value={couponData.expiryDate}
              onChange={(e) => setCouponData({ ...couponData, expiryDate: e.target.value })}
            />
          </div>
          <div className="form-actions1">
            <button className="btn btn-success" onClick={handleSave}>
              {editingCoupon ? "Cập nhật" : "Thêm"}
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="sp-list">
        {couponList.length === 0 ? (
          <p>Không có mã giảm giá nào.</p>
        ) : (
          couponList.map((coupon) => (
            <div key={coupon._id} className="sp-card">
              <div className="sp-info">
                <div className="sp-content">
                  <h3 className="sp-name">{coupon.code}</h3>
                  <p>Giảm: {coupon.discount}%</p>
                </div>
              </div>
              <div className="sp-actions">
                <button className="sp-btn-edit" onClick={() => handleEditCoupon(coupon)}>
                  Sửa
                </button>
                <button
                  className="sp-btn-delete"
                  onClick={() => handleDeleteCoupon(coupon._id)}
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

export default CouponManagement;
