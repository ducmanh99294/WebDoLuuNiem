import React, { useEffect, useState } from 'react';
import '../../assets/css/ShippingDetail.css';

const OrderDetail: React.FC = () => {
  const orderId = localStorage.getItem('orderId');
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');
  const [status, setStatus] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const order = orderDetail;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/v1/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setOrderDetail(data.order);
          setStatus(data.order.status);
          
          // Check if user is admin
          const userRes = await fetch('http://localhost:3000/api/v1/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await userRes.json();
          setIsAdmin(userData.user?.role === 'admin');
        }
      } catch (err) {
        console.log('err', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetail();
  }, [orderId, token]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
        setOrderDetail({ ...orderDetail, status: newStatus });
        alert('Cập nhật trạng thái thành công!');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      await handleStatusChange('cancelled');
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

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (!orderDetail) return <div>Không tìm thấy đơn hàng.</div>;

  return (
    <div className="shipping-container">
      <h2>Thông tin đơn hàng</h2>

      <div className="shipping-actions">
        <button className="btn btn-green">In hóa đơn</button>
        <button className="btn btn-green">Tải xuống hóa đơn</button>
        {order?.status !== 'cancelled' && order?.status !== 'delivered' && (
          <button className="btn btn-red" onClick={handleCancelOrder}>
            Hủy đơn hàng
          </button>
        )}
      </div>

      <div className="order-info">
        <div className="box">
          <h4>Thông tin đơn hàng</h4>
          <p><strong>Số đơn hàng:</strong> {order?.order_number || 'N/A'}</p>
          <p><strong>Thời gian:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
          <p>
            <strong>Trạng thái đơn hàng:</strong> 
            <span className={`status ${getStatusColor(order?.status)}`}>
              {order?.status || 'N/A'}
            </span>
          </p>
          <p><strong>Phương thức thanh toán:</strong> {order?.payment?.method || 'N/A'}</p>
          <p><strong>Trạng thái thanh toán:</strong> {order?.payment?.status || 'N/A'}</p>
        </div>

        <div className="box">
          <h4>Địa chỉ giao hàng</h4>
          <p><strong>Họ và tên:</strong> {order?.customer?.fullName || 'N/A'}</p>
          <p><strong>Điện thoại:</strong> {order?.customer?.phone || 'N/A'}</p>
          <p><strong>Email:</strong> {order?.customer?.email || 'N/A'}</p>
          <p><strong>Địa chỉ:</strong> {order?.shipping?.address || 'N/A'}</p>
        </div>
      </div>

      {isAdmin && (
        <div className="admin-actions">
          <h4>Cập nhật trạng thái đơn hàng</h4>
          <div className="status-buttons">
            {order?.status === 'pending' && (
              <button className="btn btn-blue" onClick={() => handleStatusChange('confirmed')}>
                Xác nhận đơn hàng
              </button>
            )}
            {order?.status === 'confirmed' && (
              <button className="btn btn-blue" onClick={() => handleStatusChange('shipped')}>
                Đã giao cho đơn vị vận chuyển
              </button>
            )}
            {order?.status === 'shipped' && (
              <button className="btn btn-blue" onClick={() => handleStatusChange('delivered')}>
                Đã giao hàng thành công
              </button>
            )}
          </div>
        </div>
      )}

      {/* ... (phần còn lại giữ nguyên) ... */}
    </div>
  );
};

export default OrderDetail;