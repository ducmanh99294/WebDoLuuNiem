import React from "react";
import { categories } from "../components/data/categorydata";
import '../assets/css/category.css'

const CategoryList: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh mục nổi bật</h2>
      <div className="boder">
        {categories.map((cat) => (
          <div className="O"
            key={cat.id}
          > 
          <button>
          <div className="b1">
            
            <img
              src={`/images/${cat.image}`}
              alt={cat.name}
              className="w-12 h-12 mx-auto mb-2 object-contain"
            />
            <h6 className="font-medium text-sm">{cat.name}</h6>
            <p className="text-p1">{cat.description}</p>
          </div>
</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
