import React, { useEffect, useState } from 'react';
// import { categories } from "../components/data/categorydata";
import '../assets/css/category.css'
import { Link, useParams } from 'react-router-dom';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/categories');
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error('Lỗi gọi API danh mục:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh mục nổi bật</h2>
      { loading ? (
        <p>Đang tải danh mục...</p>
      ) : (
          <div className="boder">
        {categories.map((cate) => {
  console.log('cate._id:', cate._id); // ✅ Log _id

  return (
    <div className="O" key={cate._id} onClick={() => {localStorage.setItem('categoryId', cate._id)}}>
      <Link to={`/category/${cate._id}`} style={{textDecoration: 'none', color: 'black'}}>
        <div className="b1">
          <img
            src={cate.image}
            alt={cate.name}
            className="w-12 h-16 mx-auto mb-2 object-contain"
          />
          <h6 className="font-medium text-sm">{cate.name}</h6>
          <p className="text-p1">{cate.description}</p>
        </div>
      </Link>
    </div>
  );
})}

      </div>
      )}
    
    </div>
  );
};

export default CategoryList;
