import React, { useEffect, useState } from 'react';
import '../../assets/css/ShippingDetail.css';

const OrderDetail: React.FC = () => {
  const orderId = localStorage.getItem('orderId');
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');
  const order = orderDetail;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setOrderDetail(data.order);
          console.log('Order data: ', data.order);
        } else {
          console.log('failed');
        }
      } catch (err) {
        console.log('err', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetail();
  }, [orderId]);

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (!orderDetail) return <div>Không tìm thấy đơn hàng.</div>;

  return (
    <div className="shipping-container">
      <h2>Thông tin đơn hàng</h2>

      <div className="shipping-actions">
        <button className="btn btn-green">In hóa đơn</button>
        <button className="btn btn-green">Tải xuống hóa đơn</button>
        <button className="btn btn-red">Hủy đơn hàng</button>
      </div>

      <div className="order-info">
        <div className="box">
          <h4>Thông tin đơn hàng</h4>
          <p><strong>Số đơn hàng:</strong> {order?.order_number || 'N/A'}</p>
          <p><strong>Thời gian:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Trạng thái đơn hàng:</strong> {order?.status || 'N/A'}</p>
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

      <div className="order-products">
        <h4>Sản phẩm</h4>
        {order?.products?.map((item: any, index: number) => (
          <div className="product-item" key={index}>
            <img
              src={item?.product?.images?.[0]?.image || '/default-image.jpg'}
              alt={item?.product?.name || 'Sản phẩm'}
              style={{ width: 80, height: 80, objectFit: 'cover' }}
            />
            <div>
              <p><strong>{item?.product?.name || 'Không rõ tên'}</strong></p>
              <p>Mã: {item?.product?._id || 'N/A'}</p>
              <p>Số lượng: {item?.quantity ?? 0}</p>
              <p>Giá: {(item?.price ?? 0).toLocaleString()} VND</p>
            </div>
          </div>
        ))}
      </div>

      <div className="total">
        Tổng cộng: <strong>{(order?.total_price ?? 0).toLocaleString()} VND</strong>
      </div>

      <div className="shipping-status">
        <h4>Thông tin giao hàng</h4>
        <p>
          Trạng thái giao hàng:{' '}
          <span className="status pending">
            {order?.shipping?.description || 'Đang xử lý'}
          </span>
        </p>
      </div>

      <div className="upload-proof">
        <h4>Bằng chứng thanh toán</h4>
        <p>Đơn hàng hiện đang được xử lý. Vui lòng tải lên bản sao bằng chứng thanh toán:</p>
        <input type="file" accept=".jpg,.jpeg,.png" />
        <button className="btn btn-green">Tải lên</button>
      </div>
    </div>
  );
};

export default OrderDetail;
