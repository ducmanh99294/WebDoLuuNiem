import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import '../../assets/css/productcard.css';
import { FaHeart } from 'react-icons/fa';

const CategoryPage: React.FC = () => {
  const categoryId = localStorage.getItem('categoryId');
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Lấy sản phẩm theo danh mục
        const res1 = await fetch(`http://localhost:3000/api/v1/products/category/${categoryId}`);
        const data1 = await res1.json();
        if (data1.success) {
          setCategoryName(data1.category?.name || "");
          setProducts(data1.products);
        }

        // Lấy sản phẩm liên quan
        const res2 = await fetch(`http://localhost:3000/api/v1/products`);
        const data2 = await res2.json();
        if (data2.success) setRelated(data2.products);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", err);
      }
    };
    if (categoryId) fetchCategoryData();
  }, [categoryId]);

  function getRandomItems(arr: any[], n: number) {
  if (arr.length <= n) return arr;
  const result = [];
  const used = new Set<number>();
  while (result.length < n) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

  return (
    
    <div>
      <h2 style={{ textAlign: "center" }}>{categoryName}</h2>

      <div className="product-grid">
        {products.map((p) => {
            return (
          <div key={p._id} className="product-card">
            <img src={`http://localhost:3000/api/v1/images/${p.images[0]}`} alt={p.name} />
            <h4>{p.name}</h4>
            <p>{p.price}₫</p>
          </div>
            );
            })}
      </div>

      <h3 style={{ marginTop: 40 }}>Các sản phẩm khác</h3>
<div className="product">
  {getRandomItems(related, 5).map((p) => (
  <div className="container">
  <div className="card" style={{ width: '250px' }}>
    <div className="image-wrapper">
      <Link to={`/product-detail/${p._id}`}>
        <img src={p.images[0].image} alt={p.name} style={{ width: 200,height:164}} />
      </Link>
      <div className="label">Hot</div>
    </div>
    <div className="rating-line">
      <span className="star">{p.rating}</span>
      <span className="review-count">({p.like_count} đánh giá)</span>
    </div>
    <div className="name">{p.name}</div>
    <div className="provider">
      By <span className="provider-name">NetFood</span>
    </div>
    <div className="price-line">
      {p.discount > 0 ? (
        <div>
          <span className="final-price">
            {(p.price - (p.price * p.discount) / 100).toLocaleString()}₫
          </span>
          <span className="old-price">{p.price.toLocaleString()}₫</span>
        </div>
      ) : (
        <span className="final-price">{p.price.toLocaleString()}₫</span>
      )}
      <span>
        <FaHeart className="heart-icon" />
      </span>
    </div>
  </div>
</div>


  ))}
</div>
    </div>
  );
};

export default CategoryPage;