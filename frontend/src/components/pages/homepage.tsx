// src/pages/Home.tsx
import React from 'react';
import ProductCard from '../data/product';  // giả sử đây là component hiển thị 1 product
import '../../assets/css/home.css';
import Banner from '../Banner';
import WhyChooseUs from '../WhyChooseUs'
import DealsSection from '../DealsSection'
const Home: React.FC = () => {
  // data mảng sản phẩm
  const products = [
    {
      id: 1,
      category_id: 3,
      name: "Bánh Mì Thịt Nướng",
      description: "Bánh mì giòn rụm với thịt nướng thơm lừng và rau sống tươi ngon.",
      rating: 4.7,
      price: 25000,
      discount: 10,
      image: './images/anh_sp/div.product-img-action-wrap.png',
      like_count: 135,
      quantity: 50,
      view_count: 1200,
      sell_count: 300,
      create_At: "2024-12-01T10:30:00Z",
      update_At: "2025-05-20T08:15:00Z",
      is_delete: false,
      status: "available"
    },
    {
      id: 2,
      category_id: 4,
      name: "Sản phẩm khác",
      description: "Mô tả sản phẩm khác...",
      rating: 4.2,
      price: 30000,
      discount: 5,
      image: './images/anh_sp/sanpham_khac.png',
      like_count: 80,
      quantity: 20,
      view_count: 900,
      sell_count: 150,
      create_At: "2024-10-01T10:30:00Z",
      update_At: "2025-05-01T08:15:00Z",
      is_delete: false,
      status: "available"
    }
  ];

  return (
    <>
      <Banner />
      <div className="card-sp">
        <h1>Chào mừng đến với cửa hàng Đặc Sản</h1>
        <p>Chỉ 1 "cái cáo" để bạn xem thử</p>
        <div className="sp">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <DealsSection/>
      <WhyChooseUs />
    </>
  );
};

export default Home;
