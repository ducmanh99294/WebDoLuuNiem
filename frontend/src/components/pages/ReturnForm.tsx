import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/ReturnForm.css';

const ReturnForm: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        if (!token) {
          console.log('Không tìm thấy token, chuyển hướng đến /login');
          alert('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }
        if (!orderId) {
          console.log('Không tìm thấy orderId, chuyển hướng đến /orders');
          alert('Không tìm thấy ID đơn hàng');
          navigate('/orders');
          return;
        }

        console.log('Gửi yêu cầu đến API với orderId:', orderId);
        const res = await fetch(`http://localhost:3000/api/v1/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.log('Phản hồi API không thành công:', res.status, res.statusText);
          throw new Error(`Lỗi khi lấy chi tiết đơn hàng: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          console.log('Dữ liệu đơn hàng:', data.order);
          setOrderDetail(data.order);
        } else {
          throw new Error(data.message || 'Không thể lấy chi tiết đơn hàng');
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
        alert(err.message || 'Có lỗi xảy ra khi tải đơn hàng');
        navigate('/orders');
      }
    };

    if (orderId) fetchOrderDetail();
  }, [orderId, token, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles];
      if (newImages.length < 3) {
        setError('Vui lòng tải lên ít nhất 3 ảnh sản phẩm.');
      } else {
        setError('');
      }
      setImages(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (newImages.length < 3) {
      setError('Vui lòng tải lên ít nhất 3 ảnh sản phẩm.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!token) {
      alert('Vui lòng đăng nhập lại');
      navigate('/login');
      return;
    }
    if (images.length < 3) {
      setError('Vui lòng tải lên ít nhất 3 ảnh sản phẩm.');
      return;
    }
    if (!description || !reason) {
      setError('Vui lòng điền đầy đủ mô tả lỗi và lý do trả hàng.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image); // Sửa thành 'images' thay vì `images[${index}]`
      });
      formData.append('description', description);
      formData.append('reason', reason);
      formData.append('orderId', orderId || '');

      console.log('Gửi FormData:', { description, reason, orderId, images: images.map(f => f.name) });

      const res = await fetch('http://localhost:3000/api/v1/returns', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert('Yêu cầu trả hàng đã được gửi thành công!');
        navigate('/orders');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi yêu cầu trả hàng.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu trả hàng:', err);
      setError('Có lỗi xảy ra khi gửi yêu cầu trả hàng.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (!orderDetail) return <div>Đang tải chi tiết đơn hàng...</div>;

  return (
    <div className="return-form-container">
      <h2>Thủ tục trả hàng</h2>

      <div className="order-info">
        <div className="box">
          <h4>Thông tin đơn hàng</h4>
          <p><strong>Số đơn hàng:</strong> {orderDetail?.order_number || 'N/A'}</p>
          <p><strong>Thời gian:</strong> {orderDetail?.createdAt ? new Date(orderDetail.createdAt).toLocaleString() : 'N/A'}</p>
          <p>
            <strong>Trạng thái đơn hàng:</strong> 
            <span className={`status ${getStatusColor(orderDetail?.status)}`}>
              {orderDetail?.status || 'N/A'}
            </span>
          </p>
          <p><strong>Phương thức thanh toán:</strong> {orderDetail?.payment?.method || 'N/A'}</p>
          <p><strong>Trạng thái thanh toán:</strong> {orderDetail?.payment?.status || 'N/A'}</p>
        </div>

        <div className="box">
          <h4>Địa chỉ giao hàng</h4>
          <p><strong>Họ và tên:</strong> {orderDetail?.customer?.fullName || 'N/A'}</p>
          <p><strong>Điện thoại:</strong> {orderDetail?.customer?.phone || 'N/A'}</p>
          <p><strong>Email:</strong> {orderDetail?.customer?.email || 'N/A'}</p>
          <p><strong>Địa chỉ:</strong> {orderDetail?.shipping?.address || 'N/A'}</p>
        </div>
      </div>

      <div className="return-form">
        <div className="form-group">
          <label>Tải lên ảnh sản phẩm lỗi (ít nhất 3 ảnh):</label>
          <p className="instruction">Click để chọn nhiều ảnh cùng lúc</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <p>Số ảnh đã tải: {images.length}</p>
          {images.length > 0 && (
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className="preview-image"
                  />
                  <button
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Mô tả lỗi sản phẩm:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết lỗi của sản phẩm..."
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>Lý do trả hàng:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do bạn muốn trả hàng..."
            rows={3}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          className="btn btn-blue"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu trả hàng'}
        </button>
      </div>
    </div>
  );
};

export default ReturnForm;