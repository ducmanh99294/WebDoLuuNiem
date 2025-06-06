import React from 'react';
import '../../assets/css/productcard.css';
import { FaHeart } from 'react-icons/fa';
import type { Product } from '../data/product';
// 👉 Import type Product từ productData


interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="container">
      <div className="card">
        <div className="image-wrapper">
          <img src={product.image} alt={product.name} className="image" />
          <div className="label">Hot</div>
        </div>
        <div className="rating-line">
          <span className="star">{product.rating}</span>
          <span className="review-count">({product.like_count} đánh giá)</span>
        </div>
        <div className="name">{product.name}</div>
        <div className="provider">
          By <span className="provider-name">NetFood</span>
        </div>
        <div className="price-line">
          <span className="final-price">{finalPrice.toLocaleString()}₫</span>
          <span className="old-price">{product.price.toLocaleString()}₫</span>
          <span><FaHeart className="heart-icon" /></span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
