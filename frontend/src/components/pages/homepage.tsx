// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../pages/ProductCard'; // vẫn giữ nguyên
import '../../assets/css/home.css';
import Banner from '../Banner';
import WhyChooseUs from '../WhyChooseUs';
import DealsSection from '../DealsSection';
import EventPage from './Event';
import { Link, useNavigate } from 'react-router-dom';
import CategoryList from '../category';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 1. Lấy tất cả danh mục
        const catRes = await fetch('http://localhost:3000/api/v1/categories');
        const catData = await catRes.json();
        setCategories(catData.data || []);

        // 2. Lấy sản phẩm theo danh mục
        const promises = catData.data.map(async (cat: any) => {
          const prodRes = await fetch(`http://localhost:3000/api/v1/products/category/${cat._id}`);
          const prodData = await prodRes.json();
          return { categoryId: cat._id, products: prodData.products.slice(0, 4) }; // Lấy 4 sản phẩm đầu
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
        const res = await fetch('http://localhost:3000/api/v1/products');
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
      <CategoryList />
      <div className="card-sp">
        {/* <h1>Chào mừng đến với cửa hàng Đặc Sản</h1> */}
        <h1>Sản phẩm nổi bật </h1>
        <div className="sp">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : (
             products.map(product => (
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
      <DealsSection />
      <WhyChooseUs />
    </>
  );
};

export default Home;