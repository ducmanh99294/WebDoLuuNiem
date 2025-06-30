// File: Shipping.tsx
import React from 'react';
import { mockOrder } from '../../components/data/test';
import '../../assets/css/ShippingDetail.css';

const Shipping: React.FC = () => {
  const order = mockOrder;

  return (
    <div className="shipping-container">
      <h2>Thông tin đơn hàng </h2>

      <div className="shipping-actions">
        <button className="btn btn-green">In hóa đơn</button>
        <button className="btn btn-green">Tải xuống hóa đơn</button>
        <button className="btn btn-red">Hủy đơn hàng</button>
      </div>

      <div className="order-info">
        <div className="box">
          <h4>Thông tin đơn hàng</h4>
          <p><strong>Số đơn hàng:</strong> {order.id}</p>
          <p><strong>Thời gian:</strong> {order.createdAt}</p>
          <p><strong>Trạng thái đơn hàng:</strong> {order.status}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus}</p>
        </div>

        <div className="box">
          <h4>Địa chỉ giao hàng</h4>
          <p><strong>Họ và tên:</strong> {order.user.name}</p>
          <p><strong>Điện thoại:</strong> {order.user.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.user.address}</p>
        </div>
      </div>

      <div className="order-products">
        <h4>Sản phẩm</h4>
        {order.products.map((item) => (
          <div className="product-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div>
              <p><strong>{item.name}</strong></p>
              <p>Mã: {item.id}</p>
              <p>Số lượng: {item.quantity}</p>
              <p>Giá: ${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="total">Tổng cộng: <strong>${order.totalAmount.toFixed(2)}</strong></div>

      <div className="shipping-status">
        <h4>Thông tin giao hàng</h4>
        <p>Trạng thái giao hàng: <span className="status pending">{order.shippingStatus}</span></p>
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

export default Shipping;
