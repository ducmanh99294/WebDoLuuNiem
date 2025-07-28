import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../../assets/css/home.css';
import Banner from '../Banner';
import WhyChooseUs from '../WhyChooseUs';
import EventPage from './Event';
import { useNavigate } from 'react-router-dom';
import CategoryList from '../category';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});
  const [topRatedProducts, setTopRatedProducts] = useState<any[]>([]);
  const [mostLikedProducts, setMostLikedProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const catId = localStorage.getItem('categoryId');

  useEffect(() => {
    const fetchTopRatedAndMostLiked = async () => {
      try {
        const [prodRes, reviewRes, mostLikedRes] = await Promise.all([
          fetch('http://localhost:3001/api/v1/products'),
          fetch('http://localhost:3001/api/v1/reviews', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          fetch('http://localhost:3001/api/v1/like-lists/most-liked'),
        ]);

        // Xử lý sản phẩm nổi bật
        const prodData = await prodRes.json();
        const reviewData = await reviewRes.json();
        if (!prodData.success || !reviewData.success) throw new Error('Lỗi dữ liệu');

        const products = prodData.products;
        const reviews = Array.isArray(reviewData.reviews) ? reviewData.reviews : [];

        const reviewMap: Record<string, { total: number; count: number }> = {};
        for (const review of reviews) {
          const id = review.product;
          if (!reviewMap[id]) {
            reviewMap[id] = { total: 0, count: 0 };
          }
          reviewMap[id].total += review.rating;
          reviewMap[id].count += 1;
        }

        const productsWithRating = products.map((prod: any) => {
          const r = reviewMap[prod._id];
          const avgRating =
            r && r.count > 0
              ? r.total / r.count
              : typeof prod.rating === 'number'
              ? prod.rating
              : 0;

          return { ...prod, avgRating };
        });

        const sortedTopRated = productsWithRating
          .sort((a: any, b: any) => b.avgRating - a.avgRating)
          .slice(0, 5);
        setTopRatedProducts(sortedTopRated);

        // Xử lý sản phẩm yêu thích
        const mostLikedData = await mostLikedRes.json();
        if (mostLikedData.success) {
          setMostLikedProducts(mostLikedData.products);
        } else {
          console.error('Lỗi khi lấy sản phẩm yêu thích:', mostLikedData.message);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const catRes = await fetch('http://localhost:3001/api/v1/categories');
        const catData = await catRes.json();
        setCategories(catData.data || []);

        const promises = catData.data.map(async (cat: any) => {
          const prodRes = await fetch(`http://localhost:3001/api/v1/products/category/${cat._id}`);
          const prodData = await prodRes.json();
          return { categoryId: cat._id, products: prodData.data?.slice(0, 4) || [] };
        });

        const result = await Promise.all(promises);
        const productMap: Record<string, any[]> = {};
        result.forEach(({ categoryId, products }) => {
          productMap[categoryId] = products;
        });

        setProductsByCategory(productMap);
      } catch (err) {
        console.error('Lỗi khi tải danh mục hoặc sản phẩm:', err);
      }
    };

    fetchTopRatedAndMostLiked();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Lỗi gọi API sản phẩm:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Banner />
      <CategoryList />
      <div className="card-sp">
        <h1 style={{ textAlign: 'center' }}>Sản phẩm nổi bật</h1>
        <div className="sp">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : topRatedProducts.length === 0 ? (
            <p>Không có sản phẩm nổi bật.</p>
          ) : (
            topRatedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
      <div className="card-sp">
        <h1 style={{ textAlign: 'center' }}>Sản phẩm yêu thích</h1>
        <div className="sp">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : mostLikedProducts.length === 0 ? (
            <p>Không có sản phẩm yêu thích.</p>
          ) : (
            mostLikedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
      <EventPage />
      <div className="category-products-container">
        <h1>Danh Mục</h1>
        {categories.map((cat) => (
          <div key={cat._id} className="category-section" onClick={() => {localStorage.setItem('categoryId', cat._id)}}>
            <div className="category-header">
              <h2>{cat.name}</h2>
              <button
                className="see-more-btn"
                onClick={() => navigate(`/category/${cat._id}`)}
              >
                Xem thêm
              </button>
            </div>
            <div className="product-list">
              {productsByCategory[cat._id]?.map((product) => (
                <ProductCard key={product._id} product={product} />
              )) || <p>Không có sản phẩm.</p>}
            </div>
          </div>
        ))}
      </div>
      <WhyChooseUs />
    </>
  );
};

export default Home;