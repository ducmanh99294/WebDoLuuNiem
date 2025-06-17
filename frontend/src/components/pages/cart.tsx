import { useNavigate } from 'react-router-dom';
import React from 'react';
import '../../assets/css/cart.css';

const CartPage: React.FC = () => {
    const navigate = useNavigate();

  return (
    
    <div className="cart-container1">
      <h2>Giỏ hàng</h2>

      <table className="cart-table1">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="product-info1">
              <img src="/images/lcd-monitor.png" alt="LCD Monitor" />
              <span>LCD Monitor</span>
            </td>
            <td>2.000.000 VND</td>
            <td>
              <input type="number" min="1" defaultValue={1} />
            </td>
            <td>6.000.000 VND</td>
          </tr>
          <tr>
            <td className="product-info1">
              <img src="/images/gamepad.png" alt="Gamepad" />
              <span>Hi Gamepad</span>
            </td>
            <td>200.000 VND</td>
            <td>
              <input type="number" min="1" defaultValue={2} />
            </td>
            <td>400.000 VND</td>
          </tr>
        </tbody>
      </table>

      <div className="cart-actions1">
        <button className="btn-outline1" onClick={() => navigate('/')}>
  Return To Shop
</button>

        <button className="btn-outline1">Update Cart</button>
      </div>

      <div className="cart-bottom1">
        <div className="voucher1">
          <input type="text" placeholder="Voucher" />
          <button className="btn-green1">Apply voucher</button>
        </div>

        <div className="cart-summary1">
          <h3>Tổng giá </h3>
          <p>Tổng  <span>6.400.000 VND</span></p>
          <p>phí vận chuyển: <span>Free</span></p>
          <p className="total1">Total: <span>6.400.000 VND</span></p>
          <button className="btn-green full-width">chuyển đến trang thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
