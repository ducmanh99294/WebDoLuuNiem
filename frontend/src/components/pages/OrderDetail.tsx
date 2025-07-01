// File: Shipping.tsx
import React, { useEffect, useState } from 'react';
import '../../assets/css/ShippingDetail.css';

const OrderDetail: React.FC = () => {
  const orderId = localStorage.getItem('orderId');
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const order = orderDetail;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setOrderDetail(data.order)
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
          <p><strong>Số đơn hàng:</strong> {orderDetail?._id}</p>
          <p><strong>Thời gian:</strong> {new Date(order?.createdAt).toLocaleString()}</p>
          <p><strong>Trạng thái đơn hàng:</strong> {order?.status}</p>
          <p><strong>Phương thức thanh toán:</strong> {order?.payment?.method}</p>
          <p><strong>Trạng thái thanh toán:</strong> {order?.payment?.status}</p>
        </div>

        <div className="box">
          <h4>Địa chỉ giao hàng</h4>
          <p><strong>Họ và tên:</strong> {order?.user?.name || 'N/A'}</p>
          <p><strong>Điện thoại:</strong> {order?.user?.phone || 'N/A'}</p>
          <p><strong>Địa chỉ:</strong> {order?.shipping?.address}</p>
        </div>
      </div>

      <div className="order-products">
        <h4>Sản phẩm</h4>
        {order?.products?.map((item: any, index: number) => (
          <div className="product-item" key={index}>
           <img src={item.product?.images?.[0]?.image}alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'cover' }}
    />
          <div>
              <p><strong>{item?.product?.name}</strong></p>
              <p>Mã: {item?.product?._id}</p>
              <p>Số lượng: {item.quantity}</p>
              <p>Giá: {(item.price).toLocaleString()} VND</p>
            </div>
          </div>
        ))}
      </div>

      <div className="total">
        Tổng cộng: <strong>{order?.total_price?.toLocaleString()} VND</strong>
      </div>

      <div className="shipping-status">
        <h4>Thông tin giao hàng</h4>
        <p>
          Trạng thái giao hàng:{" "}
          <span className="status pending">{order?.shipping?.description || 'Đang xử lý'}</span>
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