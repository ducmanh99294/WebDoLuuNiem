import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/ReturnForm.css';
import { toast } from 'react-toastify';

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

  // Kiểm tra form có hợp lệ không
  const isOrderValid = orderDetail && 
                      ['pending', 'delivered'].includes(orderDetail.status) &&
                      (new Date().getTime() - new Date(orderDetail.createdAt).getTime()) <= 5 * 24 * 60 * 60 * 1000;
  const isFormValid = isOrderValid && 
                      images.length >= 3 && 
                      description.trim().length >= 5 && 
                      reason;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        if (!token) {
          toast.error('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }
        if (!orderId) {
          toast.error('Không tìm thấy ID đơn hàng');
          navigate('/orders');
          return;
        }

        const res = await fetch(`http://localhost:3001/api/v1/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi khi lấy chi tiết đơn hàng: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setOrderDetail(data.order);
          if (!['pending', 'delivered'].includes(data.order.status)) {
            setError('Đơn hàng phải ở trạng thái chờ xác nhận hoặc đã giao để được trả hàng');
          } else if ((new Date().getTime() - new Date(data.order.createdAt).getTime()) > 5 * 24 * 60 * 60 * 1000) {
            setError('Đã quá 5 ngày kể từ khi đặt hàng, bạn không thể trả hàng');
          }
        } else {
          throw new Error(data.message || 'Không thể lấy chi tiết đơn hàng');
        }
      } catch (err: any) {
        toast.error(err.message || 'Đã có lỗi xảy ra khi tải đơn hàng');
        navigate('/orders');
      }
    };

    if (orderId) fetchOrderDetail();
  }, [orderId, token, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const maxSize = 5 * 1024 * 1024; // 5MB
      const invalidFiles = selectedFiles.filter(file => file.size > maxSize);
      if (invalidFiles.length > 0) {
        setError('Một số file đã vượt quá 5MB');
        return;
      }
      const newImages = [...images, ...selectedFiles];
      if (newImages.length < 3) {
        setError('Vui lòng tải lên ít nhất 3 ảnh sản phẩm.');
      } else if (newImages.length > 5) {
        setError('Tối đa 5 ảnh sản phẩm.');
        return;
      } else {
        setError(!isOrderValid 
          ? (['pending', 'delivered'].includes(orderDetail?.status) 
              ? 'Đã quá 5 ngày kể từ khi đặt hàng, bạn không thể trả hàng'
              : 'Đơn hàng phải đang ở trạng thái chờ xác nhận hoặc đã giao để được trả hàng')
          : '');
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
      setError(!isOrderValid 
        ? (['pending', 'delivered'].includes(orderDetail?.status) 
            ? 'Đã quá 5 ngày kể từ khi đặt hàng, bạn không thể trả hàng'
            : 'Đơn hàng phải đang ở trạng thái chờ xác nhận hoặc đã giao để được trả hàng')
        : '');
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error('Vui lòng đăng nhập lại');
      navigate('/login');
      return;
    }
    if (!isOrderValid) {
      setError(['pending', 'delivered'].includes(orderDetail?.status)
        ? 'Đã quá 5 ngày kể từ khi đặt hàng, không thể trả hàng'
        : 'Đơn hàng phải ở trạng thái chờ xác nhận hoặc đã giao để được trả hàng');
      return;
    }
    if (images.length < 3) {
      setError('Vui lòng tải lên ít nhất 3 ảnh sản phẩm.');
      return;
    }
    if (!description || description.trim().length < 5 || /^\s*$/.test(description)) {
      setError('Vui lòng nhập mô tả lỗi ít nhất 5 ký tự (không tính khoảng trắng).');
      return;
    }
    if (!reason) {
      setError('Vui lòng chọn lý do trả hàng.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });
      formData.append('description', description.trim());
      formData.append('reason', reason);
      formData.append('orderId', orderId || '');

      console.log('FormData:', {
        orderId,
        description: description.trim(),
        reason,
        images: images.map(file => file.name)
      });

      const res = await fetch('http://localhost:3001/api/v1/returns', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Yêu cầu trả hàng đã được gửi thành công!');
        navigate('/orders');
      } else {
        switch (res.status) {
          case 400:
            toast.error(data.message || 'Dữ liệu không hợp lệ');
            break;
          case 401:
            toast.error('Vui lòng đăng nhập lại');
            navigate('/login');
            break;
          case 403:
            toast.error('Bạn không có quyền thực hiện hành động này');
            break;
          case 404:
            toast.error('Không tìm thấy đơn hàng');
            break;
          default:
            toast.error(data.message || 'Có lỗi xảy ra, vui lòng thử lại');
        }
      }
    } catch (err) {
      toast.error('Không thể kết nối đến server');
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
            disabled={!isOrderValid}
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
                    disabled={!isOrderValid}
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
            disabled={!isOrderValid}
          />
        </div>

        <div className="form-group">
          <label>Lý do trả hàng:</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={!isOrderValid}
          >
            <option value="" disabled>Chọn lý do</option>
            <option value="wrong_item">Sản phẩm sai</option>
            <option value="damaged">Sản phẩm hỏng</option>
            <option value="not_as_described">Sản phẩm không như mô tả</option>
            <option value="other">Khác</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          className="btn btn-blue"
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
        >
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu trả hàng'}
        </button>
      </div>
    </div>
  );
};

export default ReturnForm;