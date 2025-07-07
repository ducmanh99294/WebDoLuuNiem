import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../assets/css/checkout.css';
import {PaymentSuccess} from '../PaymentSuccess';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [selectCoupon, setSelectCoupon] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [selectPayment, setSelectPayment] = useState<any>(null);
  const [shippingMethod, setShippingMethod] = useState<'free' | 'flat'>('free');
  const cartId = localStorage.getItem('cart_id');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [showSuccess, setShowSuccess] = useState(false);
  const shippingPrice = shippingMethod === 'flat' ? 20000 : 0;
  //hàm lấy coupon
  useEffect(() => {
    console.log("userId", userId)
    console.log("toekn", token)
  const fetchCouponData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/coupons', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const data = await res.json();
      console.log('Response data:', data);
      console.log('Coupons:', data.data);
      if (data.success  && data.data) {
        setCoupon(data.data);
      } else {
        console.error('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };
  if (cartId) fetchCouponData();
}, [cartId]);
    
  //hàm lấy cart
  useEffect(() => {
    const fetchCartDetails = async () => {
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
          console.log('Cart details:', data.cartDetails);
         
        } else {
          console.error('Failed to fetch cart details');
        }
      } catch (error) {
        console.error('Error fetching cart details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cartId) fetchCartDetails();
  }, [cartId]);

  const totalPrice = cart.reduce((sum, item) => {
    const product = item.product_id;
    return sum + product.price * item.quantity;
  }, 0);

  //hàm sử dụng coupon
  const handleApplyCoupon = (coupon: any) => {
    setSelectCoupon(coupon);
    console.log('coupon: ', coupon)
  }

  //hàm tạo order
 const handleCreateOrder = async () => {
  try {
    if (!cart || cart.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }
    if (!token || !userId) {
      alert('Vui lòng đăng nhập để đặt hàng');
      return;
    }

    const products = cart.map((item) => ({
      product: item.product_id._id || item.product_id,
      quantity: item.quantity,
      price: item.product_id.price || item.product_id._id.price,
      images: item.product_id.image || item.product_id.images || [],
    }));

    const orderData = {
  user: userId,
  products,
  order_number: Math.random().toString(36).substring(2, 10).toUpperCase(),
  total_price: totalPrice,
  coupon: selectCoupon?._id ? [selectCoupon._id] : [],
  customer: {
    fullName,
    email,
    phone
  },
  shipping: {
    address: address || 'Địa chỉ mặc định',
    price: shippingPrice,
    description: shippingMethod
  },
  payment: {
    method: selectPayment || 'cod',
    status: 'pending'
  }
};


    const res = await fetch('http://localhost:3000/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (data.success) {
      setShowSuccess(true); // ✅ Hiện khung thông báo
      // ⏳ Sau 3 giây chuyển trang
      
    } else {
      console.error('Tạo đơn hàng thất bại:', data.message);
      alert('Tạo đơn hàng thất bại.');
    }

  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    alert('Đã xảy ra lỗi khi tạo đơn hàng.');
  }
};

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

  return (
    <div className="checkout-page">
      <form className="checkout-form" onSubmit={(e) => {e.preventDefault(); handleCreateOrder();}}>
        <h3>Thông tin vận chuyển</h3>
        <div className="form-group">
          <label>Họ và tên</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Name" required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          </div>
          <div className="form-group1">
            <label>Điện thoại</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required />
          </div>
        </div>
        <div className="form-group">
          <label>Quốc gia</label>
          <select>
            <option>Việt Nam</option>
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
          <input 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='địa chỉ nhận hàng'
          required
          />
        </div>

        <h3>Phương thức thanh toán</h3>
        <div className="lable">
        <label><input type="radio" name="payment" defaultChecked onChange={(e)=>setSelectPayment(e.target.value)}/> Thanh toán khi nhận hàng (COD)</label>
        <label><input type="radio" name="payment" onChange={(e)=>setSelectPayment(e.target.value)} /> Thanh toán qua Stripe</label>
        <label><input type="radio" name="payment" onChange={(e)=>setSelectPayment(e.target.value)}/> Thanh toán qua PayPal</label>
        <label><input type="radio" name="payment" onChange={(e)=>setSelectPayment(e.target.value)}/> Razorpay</label>
        <label><input type="radio" name="payment" onChange={(e)=>setSelectPayment(e.target.value)}/> Paystack</label>
        <label><input type="radio" name="payment" onChange={(e)=>setSelectPayment(e.target.value)}/> Mollie</label>
        <label><input type="radio" name="payment" onChange={(e)=>setSelectPayment(e.target.value)}/> SSLCommerz</label>
        <label><input type="radio" name="payment" onChange={(e)=>setSelectPayment(e.target.value)}/> Chuyển khoản ngân hàng</label>
</div>
        <div className="form-group">
          <label>Ghi chú đặt hàng</label>
          <textarea placeholder="Ví dụ: giao hàng giờ hành chính" />
        </div>

        <label className="checkbox-label">
          <input type="checkbox" /> Yêu cầu xuất hóa đơn công ty
        </label>

        <button className="submit-button" onClick={handleClearCart}>Tiến hành thanh toán</button>
      </form>

      <div className="checkout-summary">
        <h3>Sản phẩm</h3>  
        <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 8 }}>  
        {loading ? (
          <p>Đang tải...</p>
        ) : (
    cart.map((item) => {
      const product = item.product_id;
      return (
        <div key={item._id} className="cart-item">
          <div className="product">
            <img src={product.images[0]?.image} alt={product.name} style={{ width: 68, height: 68, objectFit: 'cover', cursor: 'pointer', border: '1px solid #ccc' }} />
            <div>
              <p>{product.name}</p>
              <p>Giá: {product.price.toLocaleString()} VND</p>
              <p>Số lượng: {item.quantity}</p>
              <p>Thành tiền: {(product.price * item.quantity).toLocaleString()} VND</p>
            </div>
          </div>
        </div>
      );
          }))}
</div> 
        <div className="shipping-method">
          <label>
            <input
              type="radio"
              name="shipping"
              value="free"
              checked={shippingMethod === 'free'}
              onChange={() => setShippingMethod('free')}
            />
            Local Pickup - Miễn phí
          </label>
          <label>
            <input
              type="radio"
              name="shipping"
              value="flat"
              checked={shippingMethod === 'flat'}
              onChange={() => setShippingMethod('flat')}
            />
            Flat Rate - 20,000 VND
          </label>
        </div>


        <div className="summary">
          <p>Thành tiền: <span>{totalPrice.toLocaleString()} VND</span></p>
          <p>Phí vận chuyển: <span>$0.00</span></p>
          {selectCoupon ? (
          <p>
            Đã áp dụng mã: {selectCoupon.code} - Giảm {selectCoupon.discount}%
          </p>
        ) : (
          <p style={{ color: 'gray' }}>Chưa áp mã giảm giá</p>
        )}

          <h4>Tổng cộng: <span>{(totalPrice * (1 - (selectCoupon?.discount || 0) / 100) + shippingPrice).toLocaleString()} VND</span></h4>
        </div>

        <h3>Mã phiếu giảm giá</h3>
        <div className="coupons"> 
        {coupon.map((coupon) => (
          <div key={coupon._id} className='coupon'>
            <span>{coupon.code} - Giảm {coupon.discount}%</span>
            <button onClick={() => handleApplyCoupon(coupon)}>Áp dụng</button>
          </div>
        ))}
      </div>
      </div>
      {showSuccess && <PaymentSuccess onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default Checkout;
