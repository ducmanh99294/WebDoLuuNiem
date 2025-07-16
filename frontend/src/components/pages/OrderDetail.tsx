import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/ShippingDetail.css';

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const orderId = localStorage.getItem('orderId');
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');
  const [status, setStatus] = useState<string>('');

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
          setStatus(data.order.status);
        } else {
          throw new Error(data.message || 'Không thể lấy chi tiết đơn hàng');
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
        alert(err.message || 'Có lỗi xảy ra khi tải đơn hàng');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetail();
  }, [orderId, token, navigate]);

  const handleCancelOrder = () => {
    if (!orderId) {
      console.log('Không tìm thấy orderId, chuyển hướng đến /orders');
      alert('Không tìm thấy ID đơn hàng');
      navigate('/orders');
      return;
    }
    console.log('Chuyển hướng đến return-form với orderId:', orderId);
    navigate(`/return-form/${orderId}`);
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

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (!orderDetail) return <div>Không tìm thấy đơn hàng.</div>;

  return (
    <div className="shipping-container">
      <h2>Thông tin đơn hàng</h2>

      <div className="shipping-actions">
        <button className="btn btn-green">In hóa đơn</button>
        <button className="btn btn-green">Tải xuống hóa đơn</button>
        {orderDetail?.status !== 'cancelled' && orderDetail?.status !== 'delivered' && (
          <button className="btn btn-red" onClick={handleCancelOrder}>
            Hủy đơn hàng
          </button>
        )}
      </div>

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
    </div>
  );
};

export default OrderDetail;