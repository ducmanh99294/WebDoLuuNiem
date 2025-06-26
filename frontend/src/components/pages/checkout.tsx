import React from 'react';
import '../../assets/css/checkout.css';

const Checkout: React.FC = () => {
  return (
    <div className="checkout-page">
      <form className="checkout-form">
        <h3>Thông tin vận chuyển</h3>
        <div className="form-group">
          <label>Họ và tên</label>
          <input type="text" placeholder="Name " />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Email" />
          </div>
          <div className="form-group1">
            <label>Điện thoại</label>
            <input type="text" placeholder="Phone number" />
          </div>
        </div>
        <div className="form-group">
          <label>Quốc gia</label>
          <select>
            <option>coutry</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>tỉnh  </label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Thành phố</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <input type="text" />
        </div>

        <h3>Phương thức thanh toán</h3>
        <div className="lable">
        <label><input type="radio" name="payment" defaultChecked /> Thanh toán khi nhận hàng (COD)</label>
        <label><input type="radio" name="payment" /> Thanh toán qua Stripe</label>
        <label><input type="radio" name="payment" /> Thanh toán qua PayPal</label>
        <label><input type="radio" name="payment" /> Razorpay</label>
        <label><input type="radio" name="payment" /> Paystack</label>
        <label><input type="radio" name="payment" /> Mollie</label>
        <label><input type="radio" name="payment" /> SSLCommerz</label>
        <label><input type="radio" name="payment" /> Chuyển khoản ngân hàng</label>
</div>
        <div className="form-group">
          <label>Ghi chú đặt hàng</label>
          <textarea placeholder="Ví dụ: giao hàng giờ hành chính" />
        </div>

        <label className="checkbox-label">
          <input type="checkbox" /> Yêu cầu xuất hóa đơn công ty
        </label>

        <button className="submit-button">Tiến hành thanh toán</button>
      </form>

      <div className="checkout-summary">
        <h3>Sản phẩm</h3>
        <div className="product">
          <img src="/images/product.jpg" alt="Product" />
          <div>
            <p>Hạt giống thay thế quinoa hữu cơ</p>
            <p>$704.00</p>
          </div>
        </div>

        <div className="shipping-method">
          <label><input type="radio" defaultChecked /> Local Pickup - Miễn phí</label>
          <label><input type="radio" /> Flat Rate - $20.00</label>
        </div>

        <div className="summary">
          <p>Thành tiền: <span>$704.00</span></p>
          <p>Thuế: <span>$0.00</span></p>
          <p>Phí vận chuyển: <span>$0.00</span></p>
          <h4>Tổng cộng: <span>$704.00</span></h4>
        </div>

        <h4>Mã phiếu giảm giá</h4>
        <div className="coupons">
          <div className="coupon">ZVSN8WVSDPMU <button>Áp dụng</button></div>
          <div className="coupon">VWQTQVWTTIN <button>Áp dụng</button></div>
          <div className="coupon">Q3ANZMH9L2H <button>Áp dụng</button></div>
          <div className="coupon">SILWARLBUQAN <button>Áp dụng</button></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
