import React from 'react';
import { products } from '../data/product'; // ✅ Lấy product từ data

const DetailProduct: React.FC = () => {
  const product = products[0]; // ✅ Giả sử hiển thị sản phẩm đầu tiên

  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="product-detail-container" style={{ background: '#fff', padding: 24 }}>
      <h2>Chi tiết sản phẩm</h2>

      <div className="product-main" style={{ display: 'flex', gap: 24 }}>
        {/* Product Image */}
        <div className="product-image" style={{ flex: 1 }}>
          <div style={{ background: '#eee', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={product.image} alt={product.name} style={{ maxHeight: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: 48, height: 48, background: '#ddd' }} />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info" style={{ flex: 2 }}>
          <h3>{product.name}</h3>
          <div>
            <span>{product.rating} ★★★★★ | Xem đánh giá | Đã bán {product.like_count}</span>
          </div>
          <div style={{ fontSize: 24, color: '#009900', margin: '12px 0' }}>
            {finalPrice.toLocaleString()} VND
          </div>
          <div>
            <span>Vận chuyển đến: </span>
            <select>
              <option>Hồ Chí Minh</option>
              <option>Hà Nội</option>
            </select>
          </div>
          <div style={{ margin: '12px 0' }}>
            <span>Số lượng: </span>
            <button>-</button>
            <input type="number" value={1} style={{ width: 40, textAlign: 'center' }} readOnly />
            <button>+</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button>Thêm vào giỏ hàng</button>
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>
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
    </div>
  );
};

export default DetailProduct;
