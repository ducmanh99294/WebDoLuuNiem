// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../pages/ProductCard'; // vẫn giữ nguyên
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
  const navigate = useNavigate();
  const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});
  const [topRatedProducts, setTopRatedProducts] = useState<any[]>([]);
  const catId = localStorage.getItem('categoryId')

useEffect(() => {
  const fetchTopRatedProducts = async () => {
    try {
      const [prodRes, reviewRes] = await Promise.all([
        fetch('http://localhost:3001/api/v1/products'),
        fetch('http://localhost:3001/api/v1/reviews', 
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
      ]);
      const prodData = await prodRes.json();
      const reviewData = await reviewRes.json();

      if (!prodData.success || !reviewData.success) throw new Error("Lỗi dữ liệu");
console.log("reviewData:", reviewData);

      const products = prodData.products;
      const reviews = Array.isArray(reviewData.reviews) ? reviewData.reviews : [];


      // Tính trung bình sao
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

      const sorted = productsWithRating
        .sort((a: any, b: any) => b.avgRating - a.avgRating)
        .slice(0, 5);

      setTopRatedProducts(sorted);
    } catch (err) {
      console.error('Lỗi khi tính sản phẩm nổi bật:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchTopRatedProducts();
}, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 1. Lấy tất cả danh mục
        const catRes = await fetch('http://localhost:3001/api/v1/categories');
        const catData = await catRes.json();
        setCategories(catData.data || []);

        // 2. Lấy sản phẩm theo danh mục
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Banner />
      <CategoryList/>
      <div className="card-sp">
        {/* <h1>Chào mừng đến với cửa hàng Đặc Sản</h1> */}
       <h1 style={{ textAlign: 'center' }}>Sản phẩm nổi bật </h1>
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
      <EventPage />
      <div className="category-products-container">
        <h1>Danh Mục </h1>
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