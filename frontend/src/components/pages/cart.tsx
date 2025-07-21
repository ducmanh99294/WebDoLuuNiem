

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/cart.css';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(localStorage.getItem('cart_id'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    // cập nhật lại cartId nếu user vừa đăng nhập
    const updatedCartId = localStorage.getItem('cart_id');
    if (updatedCartId !== cartId) {
      setCartId(updatedCartId);
    }
  }, [token]);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        if (token && cartId) {
          // ✅ Người dùng đã đăng nhập
          const res = await fetch(`http://localhost:3001/api/v1/cart-details/cart/${cartId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });

          const data = await res.json();
          if (data.success && Array.isArray(data.cartDetails)) {
            setCart(data.cartDetails);
          }
        } else {
          // ✅ Người dùng chưa đăng nhập → lấy giỏ hàng tạm từ localStorage
          const tempCart = JSON.parse(localStorage.getItem('temp_cart') || '[]');
          const products: any[] = [];

          for (const item of tempCart) {
            const res = await fetch(`http://localhost:3001/api/v1/products/${item.product_id}`);
            const data = await res.json();
            if (data && data._id) {
              products.push({ _id: item.product_id, quantity: item.quantity, product_id: data });
            }
          }

          setCart(products);
        }
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [cartId, token]);

  // Hàm xử lý xóa từng sản phẩm
  const handleDeleteProduct = async (cartDetailId: string) => {
    if (!token) {
      // Nếu chưa đăng nhập → xóa khỏi localStorage
      const tempCart = JSON.parse(localStorage.getItem('temp_cart') || '[]');
      const newCart = tempCart.filter((item: any) => item.product_id !== cartDetailId);
      localStorage.setItem('temp_cart', JSON.stringify(newCart));
      setCart(prev => prev.filter(item => item.product_id._id !== cartDetailId));
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/v1/cart-details/${cartDetailId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setCart(prev => prev.filter(item => item._id !== cartDetailId));
      }
    } catch (err) {
      console.error('Xoá sản phẩm lỗi:', err);
    }
  };

  // Cập nhật số lượng
  const handleQuantityChange = async (id: string, newQty: number) => {
    const tempCart = JSON.parse(localStorage.getItem('temp_cart') || '[]');
    if (!token) {
      // Nếu chưa đăng nhập → cập nhật trong temp_cart
      const updated = tempCart.map((item: any) =>
        item.product_id === id ? { ...item, quantity: newQty } : item
      );
      localStorage.setItem('temp_cart', JSON.stringify(updated));
      setCart(prev =>
        prev.map(item =>
          item.product_id._id === id ? { ...item, quantity: newQty } : item
        )
      );
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/v1/cart-details/${id}/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });

      const data = await res.json();
      if (data.success) {
        setCart(prev =>
          prev.map(item => item._id === id ? { ...item, quantity: newQty } : item)
        );
      }
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err);
    }
  };

  // Tổng giá
  const totalPrice = cart.reduce((sum, item) => {
    const product = item.product_id;
    if (!product || !product.price) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (!cart || cart.length === 0) return <p>Giỏ hàng của bạn đang trống.</p>;

  return (
    <div className="cart-container1">
      <h2>Giỏ hàng</h2>
      <table className="cart-table1">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item: any) => {
            const product = item.product_id;
            if (!product || !product.images || product.images.length === 0) return null;

            return (
              <tr key={item._id || product._id}>
                <td>
                  <img src={product.images[0].image} alt="" style={{ width: 68, height: 68 }} />
                </td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString()} VND</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        token ? item._id : product._id,
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
                <td>{(product.price * item.quantity).toLocaleString()} VND</td>
                <td>
                  <button
                    className="btn-green"
                    onClick={() =>
                      handleDeleteProduct(token ? item._id : product._id)
                    }
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="cart-bottom1">
        <div className="voucher1">
          <input type="text" placeholder="Voucher" />
          <button className="btn-green1">Áp dụng</button>
        </div>

        <div className="cart-summary1">
          <h3>Tổng giá</h3>
          <p>Tổng: <span>{totalPrice.toLocaleString()} VND</span></p>
          <p>Phí vận chuyển: <span>Miễn phí</span></p>
          <p className="total1">Thành tiền: <span>{totalPrice.toLocaleString()} VND</span></p>
          <button
            className="btn-green full-width"
            onClick={() => {
              if (!token) navigate("/login");
              else navigate("/checkout");
            }}
          >
            Chuyển đến thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
