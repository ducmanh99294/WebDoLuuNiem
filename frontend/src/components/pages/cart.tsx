import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/css/cart.css';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const cartId = localStorage.getItem('cart_id');
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/cart-details/cart/${cartId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.cartDetails)) {
          setCart(data.cartDetails);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cartId) fetchCartData();
  }, [cartId]);

const handleClearCart = async () => {
  if (!cartId || !token) {
    alert('Thiếu thông tin giỏ hàng hoặc đăng nhập');
    return;
  }

  try {
    // Gọi API xóa tất cả sản phẩm trong giỏ hàng (cart-detail)
    const res = await fetch(`http://localhost:3000/api/v1/cart-details/cart/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      alert('Đã làm sạch giỏ hàng');
      setCart([]);
    } else {
      alert('Không thể làm sạch giỏ hàng');
    }
  } catch (err) {
    console.error('Lỗi khi làm sạch giỏ hàng:', err);
    alert('Lỗi kết nối');
  }
};

 const handleDeleteProduct = async (cartDetailId: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/cart-details/${cartDetailId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    const data = await res.json();

    if (data.success) {
      // Cập nhật lại giỏ hàng sau khi xóa
      setCart(prev => prev.filter(item => item._id !== cartDetailId));
      alert('Xóa sản phẩm khỏi giỏ hàng thành công!');
    } else {
      alert('Xóa sản phẩm thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    alert('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.');
  }
};


  const handleQuantityChange = async (cartDetailId: string, newQty: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/cart-details/${cartDetailId}/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`
        },
        body: JSON.stringify({ quantity: newQty })
      });

      const data = await res.json();
      if (data.success) {
        setCart(prev =>
          prev.map(item => item._id === cartDetailId ? { ...item, quantity: newQty } : item)
        );
      } else {
        alert('Không thể cập nhật số lượng');
      }
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err);
    }
  };

  const totalPrice = cart.reduce((sum, item) => {
  const product = item.product_id;
  if (!product || !product.price) return sum;
  return sum + product.price * item.quantity;
}, 0);


  if (loading) return <p>Đang tải...</p>;
  if (!cart || cart.length === 0) return <p>Giỏ hàng của bạn đang trống.</p>;

  return (
    <div className="cart-container1">
      <h2>Giỏ hàng</h2>

      <table className="cart-table1">
        <thead>
          <tr>
            <th>hình ảnh</th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => {
              const product = item.product_id;

              // Bỏ qua item nếu product bị null (sản phẩm đã bị xóa)
              if (!product || !product.images || product.images.length === 0) return null;

              return (
                <tr key={item._id}>
                  <td>
                    <img
                      src={product.images[0].image}
                      alt=""
                      style={{ width: 68, height: 68 }}
                    />
                  </td>
                  <td className="product-info1">
                    <span>{product.name}</span>
                  </td>
                  <td>{product.price.toLocaleString()} VND</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>{(product.price * item.quantity).toLocaleString()} VND</td>
                  <td>
                    <button
                      className="btn-green"
                      onClick={() => handleDeleteProduct(item._id)}
                    >
                      xóa
                    </button>
                  </td>
                </tr>
              );
            })}

        </tbody>
      </table>

      <div className="cart-actions1">
        <button className="btn-outline1" onClick={() => navigate('/')}>
          Return To Shop
        </button>
        <button className="btn-outline1" onClick={handleClearCart}>Update Cart</button>
      </div>

      <div className="cart-bottom1">
        <div className="voucher1">
          <input type="text" placeholder="Voucher" />
          <button className="btn-green1">Apply voucher</button>
        </div>

        <div className="cart-summary1">
          <h3>Tổng giá</h3>
          <p>Tổng: <span>{totalPrice.toLocaleString()} VND</span></p>
          <p>Phí vận chuyển: <span>Free</span></p>
          <p className="total1">Total: <span>{totalPrice.toLocaleString()} VND</span></p>
          <button className="btn-green full-width" onClick={() => navigate('/checkout')}>
            Chuyển đến trang thanh toán
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
