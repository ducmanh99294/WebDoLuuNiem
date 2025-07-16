import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Detail.css'
import toast from 'react-hot-toast';
import AddedToCartPopup from '../AddedToCartPopup';
import CartError from '../Error';
import { jwtDecode } from 'jwt-decode';
import UserChatComponent from './UserChatComponent';
import AdminChatComponent from './AdminChatComponent';

const DetailProduct: React.FC = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const token = localStorage.getItem('token');
  const [quantity, setQuantity] = useState(1);
  const [showCartError, setShowCartError] = useState(false);
  const decoded: any = token ? jwtDecode(token) : null;
  const userId = decoded?.id;
  const role = decoded?.role;
  const { _id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [showChat, setShowChat] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([])

   useEffect(()=>{
      const fetchBlog = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/v1/blogs`);
          const data = await res.json();
          
          if(data.success) {
            setBlogs(data.data);
            console.log(data.data)
          }
        } catch (err) {
          console.error('err', err);
        } finally {
          setLoading(false);
        }
      };
      if (blogs) fetchBlog();
    }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/products/${_id}`);
        const data = await res.json();
        console.log(data)
        setProduct(data);
        if (data?.images?.length > 0) {
          setSelectedImage(data.images[0].image);
        }
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/reviews/product/${_id}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
      }
    };

    if (_id) fetchReviews();
  }, [_id]);

  const handleSubmitReview = async () => {
  if (!token || !userId) {
    toast.error('Vui lòng đăng nhập để đánh giá');
    return;
  }

  if (!comment.trim()) {
    toast.error('Vui lòng nhập nội dung đánh giá');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/v1/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: userId,
        product: _id,
        rating: userRating,
        comment: comment.trim(),
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success('Đánh giá đã được gửi!');
      setComment('');
      setUserRating(5);

      // Cập nhật lại danh sách đánh giá
      const res2 = await fetch(`http://localhost:3000/api/v1/reviews/product/${_id}`);
      const newData = await res2.json();
      if (newData.success) {
        setReviews(newData.reviews);
      }

    } else {
      toast.error(data.message || 'Không thể gửi đánh giá');
    }
  } catch (err) {
    console.error('Lỗi gửi đánh giá:', err);
    toast.error('Lỗi khi gửi đánh giá');
  }
};

  const handleAddToCart = async () => {
  try {
    if (!product || !product._id) {
      toast.error('Thiếu thông tin sản phẩm');
      return;
    }

    if (!token || !userId) {
      const tempCart = JSON.parse(localStorage.getItem('temp_cart') || '[]');
      const existing = tempCart.find((item: any) => item.product_id === product._id);

      let updatedCart;
      if (existing) {
        updatedCart = tempCart.map((item: any) =>
          item.product_id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedCart = [...tempCart, { product_id: product._id, quantity }];
      }

      localStorage.setItem('temp_cart', JSON.stringify(updatedCart));
      toast.success('Đã thêm vào giỏ hàng tạm thời');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 10000);
      return;
    }

    let cartId = await getOrCreateCartId();

    if (!cartId) {
      toast.error('Không thể xử lý giỏ hàng');
      return;
    }

    const existingItem = await getExistingCartItem(cartId, product._id);

    if (existingItem) {
      const updated = await updateCartItemQuantity(
        existingItem._id,
        existingItem.quantity + quantity
      );
      if (updated) {
        toast.success('Đã cập nhật số lượng trong giỏ hàng');
      } else {
        toast.error('Không thể cập nhật số lượng');
      }
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng → thêm mới
      const added = await addNewCartItem(cartId, product._id, quantity);
      if (added) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 10000);
      } else {
        toast.error('Không thể thêm sản phẩm vào giỏ hàng');
      }
    }
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    toast.error('Có lỗi xảy ra khi thêm sản phẩm');
  }
};

const getOrCreateCartId = async () => {
  const cartRes = await fetch(`http://localhost:3000/api/v1/carts/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const cartData = await cartRes.json();
  const userCart = cartData?.data;

  if (userCart && userCart._id) {
    localStorage.setItem('cart_id', userCart._id);
    return userCart._id;
  }

  // Nếu chưa có thì tạo mới
  const createCartRes = await fetch(`http://localhost:3000/api/v1/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ user: userId }) 
  });

  const newCartData = await createCartRes.json();
  const newCart = newCartData?.data;

  if (newCart && newCart._id) {
    localStorage.setItem('cart_id', newCart._id);
    return newCart._id;
  }

  return null;
};

const getExistingCartItem = async (cartId: string, productId: string) => {
  const res = await fetch(`http://localhost:3000/api/v1/cart-details/cart/${cartId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data.cartDetails?.find(
  (item: any) =>
    item.product_id &&
    item.product_id._id &&
    item.product_id._id.toString() === productId
);
};

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} style={{ color: '#ffc107' }}>★</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" style={{ color: '#ffc107' }}>☆</span>);
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} style={{ color: '#ddd' }}>★</span>);
  }

  return stars;
};

const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
  const res = await fetch(`http://localhost:3000/api/v1/cart-details/${itemId}/quantity`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ quantity: newQuantity })
  });

  const result = await res.json();
  return result.success;
};

const addNewCartItem = async (cartId: string, productId: string, quantity: number) => {
  const res = await fetch(`http://localhost:3000/api/v1/cart-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ cart_id: cartId, product_id: productId, quantity })
  });

  const result = await res.json();
  return result.success;
};

  // hàm mua ngay
 const handleBuyNow = async () => {
  try {
    if (!token || !userId) {
      toast.error('Vui lòng đăng nhập để mua sản phẩm');
      return;
    }
    
    if (!_id) {
      toast.error('Thiếu thông tin sản phẩm');
      return;
    }

    const cartId = await getOrCreateCartId();
    if (!cartId) {
      toast.error('Không thể xử lý giỏ hàng');
      return;
    }

    const existingItem = await getExistingCartItem(cartId, _id);

    if (existingItem) {
      const updated = await updateCartItemQuantity(existingItem._id, quantity);
      if (!updated) {
        toast.error('Không thể cập nhật số lượng sản phẩm');
        return;
      }
    } else {
      const added = await addNewCartItem(cartId, _id, quantity);
      if (!added) {
        toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        return;
      }
    }

    toast.success('Chuyển đến thanh toán...');
    // Điều hướng sang trang thanh toán
    navigate('/checkout');

  } catch (error) {
    console.error('Lỗi khi xử lý mua ngay:', error);
    toast.error('Có lỗi xảy ra khi mua sản phẩm');
  }
};

  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;

return (
  <div className="product-detail-container" style={{ background: '#fff', padding: 24, position: 'relative' }}>
    <h2>Chi tiết sản phẩm</h2>

    <div className="product-main" style={{ display: 'flex', gap: 24 }}>
      {/* Hình ảnh sản phẩm */}
      <div className="product-image" style={{ flex: 1 }}>
        <div style={{ background: '#eee', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={selectedImage} alt={product.name} style={{ maxHeight: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {product.images.map((img: any, index: number) => (
            <img
              key={index}
              src={img.image}
              alt={`Thumbnail ${index + 1}`}
              style={{ width: 48, height: 48, objectFit: 'cover', cursor: 'pointer', border: '1px solid #ccc' }}
              onClick={() => setSelectedImage(img.image)}
            />
          ))}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info" style={{ flex: 2 }}>
        <h3>{product.name}</h3>
        <div style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>
          <b style={{ color: '#ffb400' }}>
            {(renderStars(product.rating))} {product.rating?.toFixed(1) || '5.0'}
            </b>
          <span style={{ marginLeft: 8 }}>({product.like_count ?? 0} đánh giá)</span>
        </div>

        <div style={{ fontSize: 24, color: '#009900', margin: '12px 0' }}>
          {finalPrice.toLocaleString()} VND
        </div>
        <div>
          <span>Vận chuyển đến: </span>
          <select>{/* ... các option tỉnh thành như cũ ... */}</select>
        </div>

        {/* Chọn số lượng */}
        <div style={{ margin: '12px 0' }}>
          <div className="a3">
            <span>Số lượng: </span>
            <button type="button" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
            <input type="number" value={quantity} style={{ width: 80, textAlign: 'center' }} readOnly />
            <button type="button" onClick={() => setQuantity(prev => prev + 1)}>+</button>
          </div>
        </div>

        {/* Nút mua */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleAddToCart} className='a2'>Thêm vào giỏ hàng</button>
          <button className='a1' onClick={handleBuyNow}>Mua ngay</button>
        </div>

        {/* Liên hệ */}
        <div style={{ marginTop: 16 }}>
          <span>Liên hệ cửa hàng: </span>
          <span style={{ color: '#009900', fontWeight: 'bold' }}>0909786434</span>
          <button style={{ marginLeft: 8 }} onClick={() => setShowChat(true)}>Gửi tin nhắn</button>
        </div>
      </div>

      {/* Tin tức nổi bật */}
      <div className="product-news" style={{ flex: 1 }}>
        <h4>Tin tức nổi bật</h4>
        {blogs.slice(0, 4).map(blog => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            onClick={() => { localStorage.setItem('blogId', blog._id) }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: 16,
              background: '#eee',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#ddd')}
            onMouseLeave={e => (e.currentTarget.style.background = '#eee')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
              <img src={blog.image[0]} alt="" style={{ width: 48, height: 48, background: '#ddd' }} />
              <div>{blog.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>

    {/* Thông tin và đánh giá */}
    <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
      <div style={{ flex: 2 }}>
        <h4>Thông tin sản phẩm</h4>
        <p>{product.description || 'Đang cập nhật mô tả...'}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <img src="https://via.placeholder.com/100" alt="Ảnh mô tả" />
          <img src="https://via.placeholder.com/100" alt="Ảnh mô tả" />
        </div>

        {/* Đánh giá sản phẩm */}
        <div style={{ marginTop: 32 }}>
          <h4>Đánh giá sản phẩm</h4>

          <div style={{ fontSize: 24, marginBottom: 8 }}>
            Trung bình: 
            <div style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>
          <b style={{ color: '#ffb400' }}>
            {(renderStars(product.rating))} {product.rating?.toFixed(1) || '5.0'}
            </b>
          <span style={{ marginLeft: 8 }}>({product.like_count ?? 0} đánh giá)</span>
        </div>
          </div>
        
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} style={{ borderTop: '1px solid #ddd', padding: '8px 0' }}>
                <div style={{ fontWeight: 'bold' }}>{review.user?.name || 'Người dùng ẩn danh'}</div>
                <div style={{ color: '#ffb400' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <div>{review.comment}</div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {new Date(review.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}

          {token && (
            <div style={{ marginTop: 16 }}>
              <h5>Gửi đánh giá của bạn</h5>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setUserRating(star)}
                    style={{
                      cursor: 'pointer',
                      color: star <= userRating ? '#ffb400' : '#ccc',
                      fontSize: 24,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Viết đánh giá của bạn..."
                style={{ width: '100%', marginTop: 8 }}
              ></textarea>
              <button onClick={handleSubmitReview} style={{ marginTop: 8 }}>
                Gửi đánh giá
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar chính sách hoặc thông tin thêm */}
      <div style={{ flex: 1 }}>
        <h4>Chính sách của cửa hàng</h4>
        <ul>
          <li>Phương thức thanh toán đa dạng</li>
          <li>Chính sách đổi trả 7 ngày</li>
          <li>Hỗ trợ vận chuyển toàn quốc</li>
        </ul>
      </div>
    </div>

    {/* Footer */}
    <div style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <b>Shop Mall</b>
        <div>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</div>
        <div>Email: example@gmail.com</div>
      </div>
      <div>
        <b>Chính sách</b>
        <div>Phương thức thanh toán</div>
        <div>Chính sách đổi trả</div>
      </div>
      <div>
        <b>App</b>
        <div>Đăng ký nhận tin</div>
        <div><img src="https://via.placeholder.com/40" alt="App" /></div>
      </div>
    </div>

    {/* Chat và popup */}
    {showPopup && <AddedToCartPopup onClose={() => setShowPopup(false)} />}
    {showCartError && <CartError onClose={() => setShowCartError(false)} />}
    <button
      onClick={() => setShowChat(true)}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        backgroundColor: '#ff4d4f',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}
    >
      Chat
    </button>
    {showChat && (
      role === 'admin' ? (
        <AdminChatComponent adminId={userId} onClose={() => setShowChat(false)} />
      ) : (
        <UserChatComponent productId={_id!} product={product} userId={userId} onClose={() => setShowChat(false)} />
      )
    )}
  </div>
);
};

export default DetailProduct;