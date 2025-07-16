import React, { useEffect, useState } from "react";
import { FaPlus } from 'react-icons/fa';
import "../../../assets/css/Dashboard.css";
import { _descriptors } from "chart.js/helpers";


const AdminEvents: React.FC = () => {
  const [productList, setProductList] = useState<any[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [addingEvent, setAddingEvent] = useState<any | null>(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    discount: 0,
    images: [],
  });
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [subEventForm, setSubEventForm] = useState({
    product: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [images, setImages] = useState<string[]>(['']);

   useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:3000/api/v1/events");
    const data = await res.json();
    setEventList(data.data || []);
  };

    useEffect(() => {
      const fetchProductList = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:3000/api/v1/products', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (Array.isArray(data.products)) {
            setProductList(data.products);
          }
        } catch (err) {
          console.error('Lỗi khi tải danh sách sản phẩm:', err);
        }
      };

      fetchProductList();
    }, []);

const handleAddImageLink = () => {
  if (images.length >= 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }
  const link = prompt('Nhập link hình ảnh:');
  if (link) {
    setImages((prev) => [...prev, link]);
  }
};
// xử lí chọn ảnh từ máy 
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  if (images.length + files.length > 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }

  const newImages: string[] = [];
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file);
    newImages.push(url);
    // ❌ Không upload thực tế => chỉ preview
    // ✅ Nếu muốn upload thực tế, bạn upload lên Cloudinary, Firebase, rồi lấy URL đẩy vào images
  });

  setImages((prev) => [...prev, ...newImages]);
};
// xử lí xóa ảnh 
const handleRemoveImage = (index: number) => {
  setImages(images.filter((_, i) => i !== index));
};
 // hàm mở form sửa sản phẩm 
  const handleEditEvent = (event: any) => {
  setEditingEvent({ 
  ...event, 
  images: Array.isArray(event.images) ? event.images : [''] 
});

};

// hàm thêm sản phẩm 
const handleSaveNewEvent = async () => {
  const token = localStorage.getItem("token");

  // ✅ Log dữ liệu đang gửi
  console.log("📤 Dữ liệu đang gửi lên:", addingEvent);

  try {
    const res = await fetch("http://localhost:3000/api/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addingEvent), // Dùng addingEvent, không dùng newEvent
    });

    const data = await res.json();
    console.log("📥 Phản hồi từ server:", data);

    if (res.ok) {
      alert("✅ Tạo sự kiện thành công!");
      setAddingEvent(null);
      setNewEvent({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        discount: 0,
        images: [],
      });
      fetchEvents();
    } else {
      alert("❌ Thêm thất bại: " + data.message);
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi request:", error);
    alert("Đã xảy ra lỗi khi tạo sự kiện.");
  }
};


// hàm lưu chỉnh sửa 
  const handleUpdateEvent = async () => {
  const token = localStorage.getItem('token');
  if (!token || !editingEvent) {
    alert('Bạn cần đăng nhập hoặc có sự kiện để sửa');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/v1/events/${editingEvent._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: editingEvent.name,
        description: editingEvent.description,
        startDate: editingEvent.startDate,
        endDate: editingEvent.endDate,
        discount: Number(editingEvent.discount) || 0,
        location: editingEvent.location,
        image: editingEvent.image || []
      })
    });

    const data = await response.json();
    console.log('✅ Kết quả cập nhật:', data);

    if (response.ok) {
      setShowSuccess(true); 
      setEditingEvent(null);
      setEventList((prevList) =>
        prevList.map((e) =>
          e._id === editingEvent._id ? { ...e, ...editingEvent } : e
        )
      );
    } else {
      alert('❌ Cập nhật thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('🚨 Lỗi cập nhật:', error);
    alert('Đã xảy ra lỗi khi cập nhật.');
  }
};

// hàm mở form thêm sản phẩm 
const handleCreateEvent = () => {
  setAddingEvent({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    discount: 0,
    images: [],
    products: [],
  });
  setImages(['']); // reset hình ảnh
};


// Hàm xoá sản phẩm khỏi hệ thống (admin only)
const handleDeleteEvent = async (eventId: string) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('❌ Bạn cần đăng nhập với quyền Admin');
    return;
  }

  const confirmDelete = window.confirm('❗Bạn có chắc chắn muốn xóa sự kiện này?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:3000/api/v1/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('💡 Kết quả xoá:', data);

    if (response.ok) {
      alert('✅ Đã xóa sự kiện thành công!');
      setEventList((prevList) => prevList.filter((e) => e._id !== eventId));
    } else {
      alert('❌ Xóa sự kiện thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('🚨 Lỗi khi xóa sự kiện:', error);
    alert('❌ Đã xảy ra lỗi khi xóa sự kiện.');
  }
};

// thêm sản phẩm vào sự kiện
const handleAddProductToEvent = async (eventId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/v1/events/${eventId}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subEventForm),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Đã thêm sản phẩm vào sự kiện!");
      setSubEventForm({ product: "", discount: "", startDate: "", endDate: "" });
      setExpandedEventId(null);
      fetchEvents();
    } else {
      alert("❌ Lỗi: " + data.message);
    }
  };


  return (
  <div className="sp-section">
    {/* Nếu đang sửa sự kiện */}
    {editingEvent ? (
      <div className="edit-product-form">
        <h2 className="form-title">Sửa sự kiện</h2>

        <div className="form-group">
          <label>Tên sự kiện:</label>
          <input
            type="text"
            value={editingEvent.name}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, name: e.target.value })
            }
            placeholder="Nhập tên sự kiện"
          />
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea
            value={editingEvent.description}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, description: e.target.value })
            }
            placeholder="Nhập mô tả"
          />
        </div>

        <div className="form-group">
          <label>Ngày bắt đầu:</label>
          <input
            type="date"
            value={editingEvent.startDate?.substring(0, 10) || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, startDate: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Ngày kết thúc:</label>
          <input
            type="date"
            value={editingEvent.endDate?.substring(0, 10) || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, endDate: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Giảm giá (%):</label>
          <input
            type="number"
            value={editingEvent.discount}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, discount: e.target.value })
            }
            placeholder="VD: 10"
          />
        </div>

        <div className="form-group">
          <label>Địa điểm:</label>
          <input
            type="text"
            value={editingEvent.location}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, location: e.target.value })
            }
            placeholder="Nhập địa điểm áp dụng"
          />
        </div>

        <div className="form-group">
          <label>Hình ảnh:</label>
          <input
            type="text"
            value={editingEvent.images?.[0] || ""}
            onChange={(e) =>
              setEditingEvent({
                ...editingEvent,
                images: [e.target.value],
              })
            }
            placeholder="Nhập URL hình ảnh"
          />
        </div>

        <div className="form-actions1">
          <button className="btn btn-success" onClick={handleUpdateEvent}>
            Cập nhật sự kiện
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setEditingEvent(null)}
          >
            Hủy
          </button>
        </div>
      </div>
    ) : (
      <>
        {/* Nút thêm sự kiện */}
        {addingEvent && (
          <div className="edit-product-form">
            <h2 className="form-title">Thêm sản phẩm</h2>
        
            <div className="form-group">
              <label>Tên sản phẩm:</label>
              <input
                type="text"
                value={addingEvent.name}
                onChange={(e) =>
                  setAddingEvent({ ...addingEvent, name: e.target.value })
                }
                placeholder="Nhập tên sản phẩm"
              />
            </div>
        
            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                value={addingEvent.description}
                onChange={(e) =>
                  setAddingEvent({ ...addingEvent, description: e.target.value })
                }
                placeholder="Nhập mô tả"
              />
            </div>
        
            <div className="form-group">
              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                value={addingEvent.startDate}
                onChange={(e) =>
                  setAddingEvent({ ...addingEvent, startDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Ngày kết thúc:</label>
              <input
                type="date"
                value={addingEvent.endDate}
                onChange={(e) =>
                  setAddingEvent({ ...addingEvent, endDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Hình ảnh:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {images.map((img, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={img}
                alt={`Ảnh ${index + 1}`}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
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
          {images.length < 5 && (
            <>
              <button type="button" onClick={handleAddImageLink}>+ Thêm từ link</button>
              <label style={{ cursor: 'pointer', background: '#eee', padding: '6px 12px', borderRadius: '4px' }}>
                + Tải ảnh từ máy
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </>
          )}
        </div>
        
              {/* <input
                type="text"
                value={addingEvent.images?.[0]?.image || ''}
                onChange={(e) =>
                  setAddingEvent({
                    ...addingEvent,
                    images: [{ image: e.target.value }],
                  })
                }
                placeholder="Nhập link hình ảnh"
              /> */}
            </div>
        
            <div className="form-group">
          <label>Giảm giá (%):</label>
          <input
            type="number"
            value={addingEvent?.discount || ''}
            onChange={(e) =>
              setAddingEvent({ ...addingEvent, discount: e.target.value })
            }
            placeholder="Nhập giảm giá"
          />
        </div>
        
            <div className="form-actions1">
           <button className="btn btn-success" onClick={handleSaveNewEvent}>
          Thêm sản phẩm
        </button>
        
              <button className="btn btn-secondary" onClick={() => setAddingEvent(null)}>
                Hủy
              </button>
            </div>
          </div>
        )}
        
        {/* Hiển thị nút Thêm và danh sách sản phẩm */}
        <div className="add0">
        <button className="add" onClick={handleCreateEvent}>
          <FaPlus />
        </button>
        
        
        
                </div>
        {/* Danh sách sự kiện */}
        {eventList.length === 0 ? (
          <p>Không có sự kiện nào.</p>
        ) : (
          <div className="sp-list">
            {eventList.map((event) => (
              <div key={event._id} className="sp-card">
                <div className="sp-info">
                  <ImageSlider images={event.images || []} />
                  <div className="sp-content">
                    <h3 className="sp-name">{event.name}</h3>
                    <p>
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {new Date(event.startDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p>
                      <strong>Ngày kết thúc:</strong>{" "}
                      {new Date(event.endDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p>
                      <strong>Địa điểm:</strong>{" "}
                      {event.location || "Không có thông tin"}
                    </p>
                    <p>
                      <strong>Số sản phẩm áp dụng:</strong>{" "}
                      {Array.isArray(event.products)
                        ? event.products.length
                        : 0}
                    </p>
                    <p>
                      <strong>Giảm giá:</strong>{" "}
                      {event.discount ? `${event.discount}%` : "0%"}
                    </p>
                  </div>
                </div>

                <div className="sp-actions">
                  <button
                    className="sp-btn-edit"
                    onClick={() => handleEditEvent(event)}
                  >
                    Sửa
                  </button>
                  <button
                    className="sp-btn-delete"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Xoá
                  </button>
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

const ImageSlider = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, 1500);
    return () => clearTimeout(timer);
  }, [current, images.length]);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div style={{ position: "relative", width: 168, height: 168 }}>
      <img
        src={images[current] || ""}
        alt=""
        className="image"
        style={{ width: 168, height: 168, objectFit: "cover", borderRadius: 8 }}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.3)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              cursor: "pointer",
            }}
          >
            {"<"}
          </button>
          <button
            onClick={next}
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.3)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              cursor: "pointer",
            }}
          >
            {">"}
          </button>
        </>
      )}
      {/* Dots indicator */}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
          {images.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: idx === current ? "#4f46e5" : "#ccc",
                display: "inline-block",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminEvents;