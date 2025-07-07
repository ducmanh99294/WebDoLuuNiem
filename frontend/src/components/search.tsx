import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/pages/ProductCard';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useQuery();
const keyword = query.get('keyword') || 'móc khóa';
console.log('🔍 Từ khóa tìm kiếm:', keyword); // ✅

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://be-webdoluuniem.onrender.com/api/v1/products');
      const data = await res.json();
      console.log('📦 Dữ liệu trả về từ API:', data);
      setProducts(data.products || []);
    } catch (err) {
      console.error('❌ Lỗi khi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [keyword]); // ✅ THÊM keyword VÀO ĐÂY


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Kết quả tìm kiếm cho: "<span style={{ color: 'red' }}>{keyword}</span>"</h2>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : filteredProducts.length === 0 ? (
        <p>Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
