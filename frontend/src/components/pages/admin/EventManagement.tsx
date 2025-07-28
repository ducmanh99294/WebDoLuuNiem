import React, { useEffect, useState } from "react";
import { FaPlus } from 'react-icons/fa';
import "../../../assets/css/Dashboard.css";
import { _descriptors } from "chart.js/helpers";
import {CreateProductSuccess, DeleteProductSuccess, UpdateProductSuccess, ConfirmDeleteDialog} from '../../PaymentSuccess';

const AdminEvents: React.FC = () => {
  const [productList, setProductList] = useState<any[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [addingEvent, setAddingEvent] = useState<any | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);  // ảnh từ máy
  const [imageLinks, setImageLinks] = useState<string[]>([]);  // ảnh từ link
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [subEventForm, setSubEventForm] = useState({
    product: [] as string[],
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [images, setImages] = useState<string[]>(['']);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

   useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:3001/api/v1/events");
    const data = await res.json();
    console.log(data)
    setEventList(data.data || []);
  };

    useEffect(() => {
      const fetchProductList = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:3001/api/v1/products', {
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
  if (imageFiles.length + imageLinks.length >= 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }

  const link = prompt('Nhập link hình ảnh:');
  if (link) {
    setImageLinks(prev => [...prev, link]);
    setImages(prev => [...prev, link]);  
  }
};

// xử lí chọn ảnh từ máy 
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
    setImages(prev => [...prev, ...newPreviews]);
  };

  // xử lí xóa ảnh 
const handleRemoveImage = (index: number) => {
  console.log('Xóa ảnh ở index:', index);
  console.log('Trước khi xóa - images:', images);

  const newImages = [...images];
  newImages.splice(index, 1); // Xóa đúng index
  setImages(newImages);

  // Cập nhật lại các state phụ nếu có:
  const newImageLinks = newImages.filter(img => typeof img === 'string' && img.startsWith('http'));
  setImageLinks(newImageLinks);

  console.log('Sau khi xóa - images:', newImages);
};



 // hàm mở form sửa sản phẩm 
  const handleEditEvent = (event: any) => {
    setEditingEvent({ ...event });
    const imageUrls = event.images?.map((img: any) => {
    return typeof img === 'string' ? img : img?.image;
  }) || [];
    setImages(imageUrls);
    setImageFiles([]);
    setImageLinks([]);
};

  // hàm thêm sản phẩm 
  const handleSaveNewEvent = async (newEvent: any) => {
    const token = localStorage.getItem("token");
    if (!token || !newEvent) {
      alert('Bạn cần đăng nhập hoặc điền đủ thông tin.');
      return;
    }

    if (
      !addingEvent.name ||
      !addingEvent.description ||
      !addingEvent.startDate ||
      !addingEvent.endDate
    ) {
      alert("❌ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newEvent.name);
      formData.append('description', newEvent.description);
      formData.append('startDate', newEvent.startDate);
      formData.append('endDate', newEvent.endDate);
    // 👇 Gửi file từ máy (blob)
      imageFiles.forEach((file) => {
        formData.append('image', file);
      });

      // 👇 Gửi link (ảnh từ URL)
      imageLinks.forEach((url) => {
        formData.append('image', url); // Backend sẽ xử lý chuỗi URL
      });

      const res = await fetch("http://localhost:3001/api/v1/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("📥 Phản hồi từ server:", data);

      if (res.ok) {
        setShowCreateSuccess(true);
        setAddingEvent(null);
        setImages(['']); // reset ảnh sau khi thêm thành công
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
const handleUpdateEvent = async (editEvent: any) => {
  const token = localStorage.getItem("token");
  if (!token || !editingEvent) return;

  try {
    const formData = new FormData();

    formData.append("name", editEvent.name);
    formData.append("description", editEvent.description);
    formData.append("startDate", editEvent.startDate);
    formData.append("endDate", editEvent.endDate);
    formData.append("discount", editEvent.discount);
    formData.append("location", editEvent.location);

    // 🧼 Gửi chỉ các ảnh hiện còn lại (sau khi đã xoá ở UI)
    images.forEach((img) => {
      if (typeof img === 'string') {
        formData.append('image', img);
      } else {
        formData.append('image', img); // File object
      }
    });

    // 🧠 Thêm dấu hiệu để backend hiểu: đây là ảnh mới, cần thay thế ảnh cũ (nếu backend hỗ trợ)
    // Nếu không sửa backend thì chỉ cần backend override toàn bộ ảnh bằng mảng mới này

    const res = await fetch(`http://localhost:3001/api/v1/events/${editEvent._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("📥 Phản hồi từ server:", data);

    if (res.ok) {
      setShowUpdateSuccess(true);
      setAddingEvent(null);
      fetchEvents(); // Làm mới danh sách
    } else {
      alert("❌ Cập nhật thất bại: " + data.message);
    }
  } catch (error) {
    console.error("🚨 Lỗi cập nhật:", error);
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
    setImages([]);
    setImageFiles([]);  
    setImageLinks([]); 
  };


  const confirmDelete = (eventId: string) => {
  setPendingDelete(eventId);
  setShowConfirmDelete(true);
};
  // Hàm xoá sản phẩm khỏi hệ thống (admin only)
  const handleDeleteEvent = async () => {
    if (!pendingDelete) return;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('❌ Bạn cần đăng nhập với quyền Admin');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/v1/events/${pendingDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('💡 Kết quả xoá:', data);

      if (response.ok) {
        setEventList((prevList) => prevList.filter((e) => e._id !== pendingDelete));
        setShowDeleteSuccess(true);
      } else {
        alert('❌ Xóa sự kiện thất bại: ' + (data.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('🚨 Lỗi khi xóa sự kiện:', error);
    } finally {
    setShowConfirmDelete(false);
    setPendingDelete(null);
  }
  };

  // thêm sản phẩm vào sự kiện
  const handleAddProductToEvent = async (eventId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("❌ Cần đăng nhập");

    if (subEventForm.product.length === 0) {
      return alert("❗Bạn chưa chọn sản phẩm nào");
    }

    const payload = {
      products: subEventForm.product,
      discount: subEventForm.discount,
      startDate: subEventForm.startDate,
      endDate: subEventForm.endDate,
    };

    try {
      const res = await fetch(`http://localhost:3001/api/v1/events/${eventId}/add-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Đã thêm sản phẩm vào sự kiện!");
        setSubEventForm({ product: [], discount: "", startDate: "", endDate: "" });
        setExpandedEventId(null);
        fetchEvents();
      } else {
        alert("❌ Lỗi: " + data.message);
      }
    } catch (err) {
      console.error("❌ Lỗi gửi:", err);
      alert("Lỗi kết nối.");
    }
  };

  return (
  <div className="sp-section">
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
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {images.map((img, index) => (
      <div key={index} style={{ position: 'relative' }}>
        <img 
          src={    
            img.startsWith('http') ||
            img.startsWith('blob')
          ? img
          : `http://localhost:3001${img}`}
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
  {images.length < 100 && (
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
          <button className="btn btn-success" onClick={()=>handleUpdateEvent(editingEvent)}>
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
    ) : addingEvent ? (
          <div className="edit-product-form">
            <h2 className="form-title">Thêm sự kiện</h2>
        
            <div className="form-group">
              <label>Tên sự kiện:</label>
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
                <label>Địa điểm:</label>
                <input
                  type="text"
                  value={addingEvent.location}
                  onChange={(e) =>
                    setAddingEvent({ ...addingEvent, location: e.target.value })
                  }
                  placeholder="Nhập địa điểm áp dụng"
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
    ) : (
    <>
    <div className="add0">
        <button className="add" onClick={handleCreateEvent}>
          <FaPlus />
        </button>
    </div>

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
                      {event.appliedProductCount || 0}
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
                    className="sp-btn-sub"
                    onClick={() =>
                      setExpandedEventId(expandedEventId === event._id ? null : event._id)
                    }
                  >
                    {expandedEventId === event._id ? "Ẩn sự kiện nhỏ" : "tạo sự kiện nhỏ"}
                  </button>

                  <button
                    className="sp-btn-delete"
                    onClick={() => confirmDelete(event._id)}
                  >
                    Xoá
                  </button>
                </div>

                {expandedEventId === event._id && (
  <div className="sub-event-form">
    <div className="form-group">
      <label>Chọn sản phẩm:</label>
      <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }}>
        {productList.map((product) => (
          <div key={product._id}>
            <label>
              <input
                type="checkbox"
                checked={subEventForm.product.includes(product._id)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSubEventForm((prev) => ({
                    ...prev,
                    product: isChecked
                      ? [...prev.product, product._id]
                      : prev.product.filter((id) => id !== product._id),
                  }));
                }}
              />
              {" "}{product.name}
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label>Giảm giá riêng (%):</label>
      <input
        type="number"
        value={subEventForm.discount}
        onChange={(e) =>
          setSubEventForm({ ...subEventForm, discount: e.target.value })
        }
        placeholder="VD: 15"
      />
    </div>

    <div className="form-group">
      <label>thời gian bắt đầu:</label>
      <input
        type="datetime-local"
        value={subEventForm.startDate}
        onChange={(e) =>
          setSubEventForm({ ...subEventForm, startDate: e.target.value })
        }
      />
    </div>

    <div className="form-group">
      <label>thời gian kết thúc:</label>
      <input
        type="datetime-local"
        value={subEventForm.endDate}
        onChange={(e) =>
          setSubEventForm({ ...subEventForm, endDate: e.target.value })
        }
      />
    </div>

    <button
      className="sp-btn-sub"
      onClick={() => handleAddProductToEvent(event._id)}
    >
      thêm
    </button>
    <button
        className="sp-btn-delete"
        style={{ marginLeft: 8}}
        onClick={() => {
          setExpandedEventId(null);
          setSubEventForm({ product: [], discount: "", startDate: "", endDate: "" });
        }}
      >
       Hủy
      </button>
  </div>
)}
   </div>
 ))}
 </div>
 
    )} 
    </>
    )}
    {showCreateSuccess && (
      <CreateProductSuccess
        message="Thêm sự kiện thành công"
        description="sự kiện mới đã được tạo."
        buttonText="Đóng"
        onClose={() => setShowCreateSuccess(false)}
      />
    )}
    
    {showUpdateSuccess && (
      <UpdateProductSuccess
        message="Cập nhật sự kiện thành công"
        description="sự kiện đã được chỉnh sửa."
        buttonText="Đóng"
        onClose={() => setShowUpdateSuccess(false)}
      />
    )}
    
    {showDeleteSuccess && (
      <DeleteProductSuccess
        message="Xóa sự kiện thành công"
        description="sự kiện đã bị xóa khỏi hệ thống."
        buttonText="Đóng"
        onClose={() => setShowDeleteSuccess(false)}
      />
    )}
    {showConfirmDelete && (
      <ConfirmDeleteDialog
        onConfirm={handleDeleteEvent}
        onCancel={() => {
          setShowConfirmDelete(false);
          setPendingDelete(null);
        }}
      />
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

  // Tạo đường dẫn ảnh
  const getImageSrc = (imgPath: string) => {
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    return `http://localhost:3001${imgPath.startsWith('/') ? imgPath : '/' + imgPath}`;
  };

  return (
    <div style={{ position: "relative", width: 168, height: 168 }}>
      <img
        src={getImageSrc(images[current])}
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
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 4,
          }}
        >
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