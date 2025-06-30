import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/css/Detail.css'
import toast from 'react-hot-toast';

import AddedToCartPopup from '../AddedToCartPopup';
import { jwtDecode } from 'jwt-decode';


const DetailProduct: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId')
  const [quantity, setQuantity] = useState(1);
  const { _id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(product?.images[0]?.image);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/products/${_id}`);
        const data = await res.json();
        setProduct(data); //  API trả về object sản phẩm trực tiếp
        if(data?.images?.length > 0) {
          setSelectedImage(data.images[0].image); // Lấy ảnh đầu tiên làm ảnh chính
        }
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id]);

  // gọi api thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
  try {
    if (!token || !userId) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm');
      return;
    }

    // 1. Kiểm tra có giỏ hàng chưa
  const cartRes = await fetch(`http://localhost:3000/api/v1/carts/user/${userId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
});

  const cartData = await cartRes.json();
  let cartId;

  console.log('cartData:', cartData, cartData.success, Array.isArray(cartData.data));

  if (cartData.success && Array.isArray(cartData.data)) {
    // So sánh lỏng để khớp ObjectId và string
    const userCart = cartData.data.find((cart: any) => cart.user == userId);

    if (userCart) {
      cartId = userCart._id;
      localStorage.setItem('cart_id', cartId);
      console.log('Đã có giỏ hàng, cartId:', cartId);
    }
  }

  if (!cartId) {
    // 2. Nếu chưa có → tạo giỏ hàng mới
    console.log('Chưa có giỏ hàng, tạo mới...');
    const createCartRes = await fetch(`http://localhost:3000/api/v1/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ user: userId }) // Gửi userId để backend tạo cart
    });

    const newCartData = await createCartRes.json();

    if (!newCartData.success || !newCartData.cart?._id) {
      toast.error('Không thể tạo giỏ hàng');
      return;
    }

    cartId = newCartData.cart._id;
    console.log('Đã tạo giỏ hàng mới, cartId:', cartId);
  }


    // 3. Kiểm tra sản phẩm đã có trong cart-detail chưa
    console.log('Kiểm tra cart-detail cho cartId:', cartId);
    const cartDetailRes = await fetch(`http://localhost:3000/api/v1/cart-details/cart/${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
    const cartDetailData = await cartDetailRes.json();

    const existingItem = cartDetailData.cartDetails?.find((item: any) => item.product_id._id?.toString() === _id);
    console.log('existingItem:', existingItem);
    console.log(_id, 'so sánh với', existingItem?.product_id);
    if (existingItem) {
      // 4. Nếu sản phẩm đã có → tăng số lượng
      console.log('tăng số lượng:', existingItem);
      const updateRes = await fetch(`http://localhost:3000/api/v1/cart-details/${existingItem._id}/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: existingItem.quantity + 1 })
      });
      const result = await updateRes.json();
      if (result.success) {
        toast.success('Đã tăng số lượng sản phẩm trong giỏ hàng');
      } else {
        toast.error('Không thể cập nhật số lượng sản phẩm');
      }
    } else {
      // 5. Nếu chưa có sản phẩm → thêm vào cart-details
      const addRes = await fetch(`http://localhost:3000/api/v1/cart-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cart_id: cartId,
          product_id: _id,
          quantity
        })
      });
      const result = await addRes.json();
     if (result.success) {
  toast.success('Đã thêm sản phẩm vào giỏ hàng');
  setShowPopup(true);
  setTimeout(() => setShowPopup(false), 10000);
}
    }

  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
  }
};

  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="product-detail-container" style={{ background: '#fff', padding: 24 }}>
      <h2>Chi tiết sản phẩm</h2>
      <div className="product-main" style={{ display: 'flex', gap: 24 }}>
        {/* Product Image */}
        <div className="product-image" style={{ flex: 1 }}>
          <div style={{ background: '#eee', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={selectedImage} alt={product.name}  style={{ maxHeight: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
               {product.images.map((img: any, index: number) => (
                <img
                  key={index}
                  src={img.image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: 48, height: 48, objectFit: 'cover', cursor: 'pointer', border: '1px solid #ccc' }}
                  onClick={() => setSelectedImage(img.image)} // nếu muốn đổi ảnh chính
                />
              ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info" style={{ flex: 2 }}>
          <h3>{product.name}</h3>
          <div>
            <span>{product.rating} ★★★★★ | Xem đánh giá | Đã bán {product.like_count ?? 0}</span>
          </div>
          <div style={{ fontSize: 24, color: '#009900', margin: '12px 0' }}>
            {finalPrice.toLocaleString()} VND
          </div>
          <div>
            <span>Vận chuyển đến: </span>
            <select>
  <option>Tuyên Quang</option>
  <option>Lào Cai</option>
  <option>Thái Nguyên</option>
  <option>Phú Thọ</option>
  <option>Bắc Ninh</option>
  <option>Hưng Yên</option>
  <option>TP. Hải Phòng</option>
  <option>Ninh Bình</option>
  <option>Quảng Trị</option>
  <option>TP. Huế</option>
  <option>TP. Đà Nẵng</option>
  <option>Quảng Ngãi</option>
  <option>Gia Lai</option>
  <option>Khánh Hòa</option>
  <option>Lâm Đồng</option>
  <option>Đắk Lắk</option>
  <option>TP. Hồ Chí Minh</option>
  <option>Đồng Nai</option>
  <option>Tây Ninh</option>
  <option>TP. Cần Thơ</option>
  <option>Vĩnh Long</option>
  <option>Đồng Tháp</option>
  <option>Cà Mau</option>
  <option>An Giang</option>
  <option>Cao Bằng</option>
  <option>Lai Châu</option>
  <option>Điện Biên</option>
  <option>Lạng Sơn</option>
  <option>Sơn La</option>
  <option>Quảng Ninh</option>
  <option>TP. Hà Nội</option>
  <option>Thanh Hóa</option>
  <option>Nghệ An</option>
  <option>Hà Tĩnh</option>
            </select>

          </div>
          <div style={{ margin: '12px 0' }}>
            <span>Số lượng: </span>
            <button  
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>
                -
            </button>
            <input type="number" value={quantity} style={{ width: 80, textAlign: 'center'}} readOnly />
            <button 
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}>
                +
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
            <button>Mua ngay</button>
          </div>
          <div style={{ marginTop: 16 }}>
            <span>Liên hệ cửa hàng: </span>
            <span style={{ color: '#009900', fontWeight: 'bold' }}>0909786434</span>
            <button style={{ marginLeft: 8 }}>Gửi tin nhắn</button>
          </div>
        </div>

        {/* News Sidebar */}
        <div className="product-news" style={{ flex: 1 }}>
          <h4>Tin tức nổi bật</h4>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, background: '#f5f5f5', padding: 8 }}>
              <div style={{ width: 48, height: 48, background: '#ddd' }}>Ảnh</div>
              <div>Tin tức {i}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Description & Reviews */}
      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <div style={{ flex: 2 }}>
          <h4>Thông tin sản phẩm</h4>
          <p>{product.description || 'Đang cập nhật mô tả...'}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <img src="https://via.placeholder.com/100" alt="Ảnh mô tả" />
            <img src="https://via.placeholder.com/100" alt="Ảnh mô tả" />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h4>Đánh giá sản phẩm</h4>
          <div style={{ fontSize: 32, color: '#ffb400' }}>5.0 ★</div>
          <div>
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star}>
                {star}★ <progress value={star === 5 ? 80 : 10} max={100} style={{ width: 100 }} />
              </div>
            ))}
          </div>
          <button style={{ marginTop: 8 }}>Gửi đánh giá của bạn</button>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <b>Shop Mall</b>
          <div>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</div>
          <div>Email: example@gmail.com</div>
        </div>
        <div>
          <b>Chính sách của hàng</b>
          <div>Phương thức thanh toán</div>
          <div>Chính sách đổi trả</div>
        </div>
        <div>
          <b>App</b>
          <div>Đăng ký nhận tin</div>
          <div>
            <img src="https://via.placeholder.com/40" alt="App" />
          </div>
        </div>
      </div>
      {showPopup && <AddedToCartPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default DetailProduct;
