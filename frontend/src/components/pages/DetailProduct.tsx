import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/css/Detail.css'
const DetailProduct: React.FC = () => {
  const { _id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/products/${_id}`);
        const data = await res.json();
        setProduct(data); //  API trả về object sản phẩm trực tiếp
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id]);

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
            <img src={product.images[0]?.image} alt={product.name}  style={{ maxHeight: '100%' }} />
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
            <button>-</button>
            <input type="number" value={1} style={{ width: 80, textAlign: 'center' }} readOnly />
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
    </div>
  );
};

export default DetailProduct;
