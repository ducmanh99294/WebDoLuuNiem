// import React from 'react';
// import '../../assets/css/productcard.css';
// import { FaHeart } from 'react-icons/fa';
// import { Link } from 'react-router-dom';


// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   discount: number;
//   rating: number;
//   like_count: number;
//   images: { image: string }[];
// }

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const finalPrice = product.price - (product.price * product.discount) / 100 

//   return (
//     <div className="container">
//       <div className="card">
//         <div className="image-wrapper">
//           <Link to={`/product-detail/${product._id}`}>
//             {product?.images?.length > 0 && (
//             <img src={product.images[0].image} alt={product.name} className="image" 
//             />
//           )}

//           </Link>
//           <div className="label">Hot</div>
//         </div>
//         <div className="rating-line">
//           <span className="star">{product.rating}</span>
//           <span className="review-count">({product.like_count} đánh giá)</span>
//         </div>
//         <div className="name">{product.name}</div>
//         <div className="provider">
//           By <span className="provider-name">NetFood</span>
//         </div>
//         <div className="price-line">
//           {product.discount > 0 ? (
//             <div>
//               <span className="final-price">{finalPrice}₫</span>
//               <span className="old-price">{product.price}₫</span>
//             </div>
//           ) : (
//               <span className="final-price">{product.price}₫</span>
//           )
//           }
//           <span><FaHeart className="heart-icon" /></span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import React from 'react';
import '../../assets/css/productcard.css';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  rating: number;
  like_count: number;
  images: { image: string }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="container">
      <div className="card">
        <div className="image-wrapper">
          <Link to={`/product-detail/${product._id}`}>
            {product?.images?.length > 0 && (
              <img src={product.images[0].image} alt={product.name} className="image" />
            )}
          </Link>
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
          {product.discount > 0 ? (
            <div>
              <span className="final-price">{finalPrice.toLocaleString('vi-VN')}₫</span>
              <span className="old-price">{product.price.toLocaleString('vi-VN')}₫</span>
            </div>
          ) : (
            <span className="final-price">{product.price.toLocaleString('vi-VN')}₫</span>
          )}
          <span><FaHeart className="heart-icon" /></span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
