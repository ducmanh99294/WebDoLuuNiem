import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../../assets/css/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ReviewManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/reviews', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  const reviewMap = reviews.reduce((acc: any, review: any) => {
    const productId = review.product;
    if (!acc[productId]) {
      acc[productId] = { total: 0, count: 0 };
    }
    acc[productId].total += review.rating;
    acc[productId].count += 1;
    return acc;
  }, {});

  const productsWithRating = products.map((product) => {
    const stats = reviewMap[product._id] || { total: 0, count: 0 };
    const avgRating =
      stats.count > 0
        ? stats.total / stats.count
        : typeof product.rating === 'number'
        ? product.rating
        : 0;

    return { ...product, avgRating };
  });

  const sortedProducts = [...productsWithRating].sort((a, b) => b.avgRating - a.avgRating);
  const displayedProducts = showAll ? sortedProducts : sortedProducts.slice(0, 5);

  return (
    <div className="sp-section">
      <h2 className="form-title">Top sản phẩm được đánh giá cao</h2>

      {displayedProducts.length === 0 ? (
        <p>Không có sản phẩm nào được đánh giá.</p>
      ) : (
        <div className="sp-list">
          {displayedProducts.map((product) => {
            const imageSrc = product.images?.[0]?.image || '/images/default.jpg';
            return (
              <div key={product._id} className="sp-card">
                <div className="sp-info">
                  <img src={encodeURI(imageSrc)} alt={product.name} className="image" />
                  <div className="sp-content">
                    <h3 className="sp-name">{product.name || 'Sản phẩm không tên'}</h3>
                    <p><strong>Giá:</strong> {product.price?.toLocaleString() || 0}đ</p>
                    <p><strong>Mô tả:</strong> {product.description || 'Không có mô tả'}</p>
                    <p><strong>Danh mục:</strong> {product.categories?.name || 'Không có'}</p>
                    <p><strong>Đánh giá:</strong> ⭐ {product.avgRating.toFixed(1)}/5</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sortedProducts.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Ẩn bớt' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
