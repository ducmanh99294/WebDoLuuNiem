// src/pages/Home.tsx
import React from 'react';
import ProductCard from '../pages/ProductCard';  // giả sử đây là component hiển thị 1 product
import '../../assets/css/home.css';
import Banner from '../Banner';
import WhyChooseUs from '../WhyChooseUs'
import DealsSection from '../DealsSection'
import { Link } from 'react-router-dom'; // dùng Link để chuyển trang
import { products } from '../data/product';
import CategoryList from '../category';
const Home: React.FC = () => {
  // data mảng sản phẩm

  return (
    <>
      
      <Banner />
      <CategoryList/>
      <div className="card-sp">
        <h1>Chào mừng đến với cửa hàng Đặc Sản</h1>
        <p>vài sp xem thử </p>
        <Link to = "/product-detail" style={{textDecoration: 'none', color : 'black'}}>
        <div className="sp">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div></Link>
      </div>
      <DealsSection/>
      <WhyChooseUs />
    </>
  );
};

export default Home;