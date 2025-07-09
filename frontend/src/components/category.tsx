import React, { useEffect, useState } from 'react';
// import { categories } from "../components/data/categorydata";
import '../assets/css/category.css'

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/categories');
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
        {categories.map((cat) => (
          <div className="O"
            key={cat._id}
          > 
          <button>
          <div className="b1">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-12 h-16 mx-auto mb-2 object-contain"
            />
            <h6 className="font-medium text-sm">{cat.name}</h6>
            <p className="text-p1">{cat.description}</p>
          </div>
          </button>
          </div>
        ))}
      </div>
      )}
    
    </div>
  );
};

export default CategoryList;
