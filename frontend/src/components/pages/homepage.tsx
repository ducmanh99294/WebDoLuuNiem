// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../pages/ProductCard'; // vẫn giữ nguyên
import '../../assets/css/home.css';
import Banner from '../Banner';
import WhyChooseUs from '../WhyChooseUs';
import DealsSection from '../DealsSection';
import { Link } from 'react-router-dom';
import CategoryList from '../category';

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        <h1>Chào mừng đến với cửa hàng Đặc Sản</h1>
        <p>vài sp xem thử </p>
        <div className="sp">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : (
            products.map(product => (
              <Link
                key={product.id}
                to={`/product-detail/${product.id}`}
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <ProductCard product={product} />
              </Link>
            ))
          )}
        </div>
      </div>
      <DealsSection />
      <WhyChooseUs />
    </>
  );
};

export default Home;
