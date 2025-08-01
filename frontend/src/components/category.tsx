import React, { useEffect, useState } from 'react';
// import { categories } from "../components/data/categorydata";
import '../assets/css/category.css'
import { Link } from 'react-router-dom';

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
      { loading ? (
        <p>Đang tải danh mục...</p>
      ) : (
          <div className="boder">
        {categories.map((cate) => {

  return (
    <div className="O" key={cate._id} onClick={() => {localStorage.setItem('categoryId', cate._id)}}>
      <Link to={`/category/${cate._id}`} style={{textDecoration: 'none', color: 'black'}}>
        <div className="b1">
          <img
            src={     
              cate.image.startsWith('http') ||
              cate.image.startsWith('blob') ||
              cate.image.startsWith('data:image')
                ? cate.image
                : `http://localhost:3001${cate.image}`}
            alt={cate.name}
            className="w-12 h-16 mx-auto mb-2 object-contain"
          />
          <h6 className="font-medium text-sm">{cate.name}</h6>
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
