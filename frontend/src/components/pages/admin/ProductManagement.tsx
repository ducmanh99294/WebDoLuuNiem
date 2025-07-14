import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { FaPlus } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../../assets/css/Dashboard.css";
import { _descriptors } from "chart.js/helpers";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ProductManagement = () => {
  const [productList, setProductList] = useState<any[]>([]);
const [editingProduct, setEditingProduct] = useState<any | null>(null);
const [addingProduct, setAddingProduct] = useState<any | null>(null);
const [categories, setCategories] = useState<any[]>([]);
const [images, setImages] = useState<string[]>(['']);

  // hàm mở form sửa sản phẩm 
  const handleEditProduct = (product: any) => {
  setEditingProduct({ ...product });
};
// xử lí thêm ảnh từ  link 
const handleAddImageLink = () => {
  if (images.length >= 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }
  const link = prompt('Nhập link hình ảnh:');
  if (link) {
    setImages((prev) => [...prev, link]);
  }
};
// xử lí chọn ảnh từ máy 
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  if (images.length + files.length > 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }

  const newImages: string[] = [];
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file);
    newImages.push(url);
    // ❌ Không upload thực tế => chỉ preview
    // ✅ Nếu muốn upload thực tế, bạn upload lên Cloudinary, Firebase, rồi lấy URL đẩy vào images
  });

  setImages((prev) => [...prev, ...newImages]);
};
// xử lí xóa ảnh 
const handleRemoveImage = (index: number) => {
  setImages(images.filter((_, i) => i !== index));
};

// hàm mở form thêm sản phẩm 
const handleAddProductClick = () => {
  setAddingProduct({
    name: '',
    description: '',
    price: '',
    images: [{ image: '' }],
    category: '',
    discount: '',
    quantity: ''
  });
  fetchCategories();   // Thêm dòng này để chắc chắn danh mục được load
};


// lấy danh mục
const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/v1/categories', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('📂 Danh mục trả về:', data);

    if (Array.isArray(data.data)) {
      // ✅ Lọc bỏ các danh mục không có name hoặc name là null
      const validCategories = data.data.filter(cat => cat && cat.name);
      setCategories(validCategories);
    } else {
      setCategories([]);
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh mục:', error);
  }
};


// hàm lưu chỉnh sửa 
const handleUpdateProduct = async () => {
  const token = localStorage.getItem('token');
  if (!token || !editingProduct) {
    alert('Bạn cần đăng nhập hoặc có sản phẩm để sửa');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/v1/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        images: editingProduct.images,
        category: editingProduct.category?._id || editingProduct.category
      })
    });

    const data = await response.json();
    console.log('✅ Kết quả cập nhật:', data);

    // ✅ Không phụ thuộc vào data.success nữa
    if (response.ok) {  // Chỉ cần status 200~299 là thành công
      setEditingProduct(null);
      setProductList((prevList) =>
        prevList.map((p) =>
          p._id === editingProduct._id ? { ...p, ...editingProduct } : p
        )
      );
    } else {
      alert('❌ Cập nhật thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('🚨 Lỗi cập nhật:', error);
    alert('Đã xảy ra lỗi khi cập nhật.');
  }
};

// Hàm xoá sản phẩm khỏi hệ thống (admin only)
const handleDeleteProduct = async (productId: string) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('❌ Bạn cần đăng nhập với quyền Admin');
    return;
  }

  const confirmDelete = window.confirm('❗Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:3000/api/v1/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('💡 Kết quả xoá:', data);

    // ✅ Chỉ kiểm tra response.ok thay vì data.success
    if (response.ok) {
      alert('✅ Đã xóa sản phẩm thành công!');
      setProductList((prevList) => prevList.filter((p) => p._id !== productId));
    } else {
      alert('❌ Xóa sản phẩm thất bại: ' + (data.message || 'Lỗi không xác định'));
    }

  } catch (error) {
    console.error('🚨 Lỗi khi xóa sản phẩm:', error);
    alert('❌ Đã xảy ra lỗi khi xóa sản phẩm.');
  }
};

 // hàm thêm sản phẩm 
const handleSaveNewProduct = async (newProduct: any) => {
  const token = localStorage.getItem('token');
  if (!token || !newProduct) {
    alert('Bạn cần đăng nhập hoặc điền đủ thông tin.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newProduct.name,
        price: Number(newProduct.price),
        description: newProduct.description,
        images: images.map((url) => ({ image: url })),
        categories: [newProduct.category],                     // ✅ mảng id
        discount: Number(newProduct.discount) || 0,
        quantity: Number(newProduct.quantity) || 1,
        rating : 0
      })
    });

    const data = await response.json();
    if (response.ok) {
      setAddingProduct(null);
      setProductList(prev => [...prev, data.product]);
    } else {
      alert('❌ Thêm sản phẩm thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('🚨 Lỗi khi thêm sản phẩm:', error);
    alert('Đã xảy ra lỗi khi thêm sản phẩm.');
  }
};

  // Decode adminId từ token
  const token = localStorage.getItem('token');
  let adminId = '';
  if (token) {
    const decoded: any = jwtDecode(token);
    adminId = decoded.sub || decoded._id || decoded.id;
  }


    useEffect(() => {
      const fetchProductList = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:3000/api/v1/products", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          console.log(data)
          setProductList(data.products || []);
        } catch (err) {
          console.error("Lỗi tải sản phẩm:", err);
        }
      };
      fetchProductList();
    }, []);
  return (
  <div className="sp-section">
    {editingProduct ? (
      <div className="edit-product-form">
        <h2 className="form-title">Sửa sản phẩm</h2>

        <div className="form-group">
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, description: e.target.value })
            }
            placeholder="Nhập mô tả"
          />
        </div>

        <div className="form-group">
          <label>Giá:</label>
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
            placeholder="Nhập giá"
          />
        </div>

        <div className="form-group">
          <label>Hình ảnh:</label>
          <input
            type="text"
            value={editingProduct.images?.[0]?.image || ''}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                images: [{ image: e.target.value }],
              })
            }
            placeholder="Nhập link hình ảnh"
          />
        </div>

        <div className="form-group">
          <label>Danh mục:</label>
          <select
            value={addingProduct.category || ''}
            onChange={(e) =>
              setAddingProduct({ ...addingProduct, category: e.target.value })
            }
          >
            <option value="">-- Chọn danh mục --</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-actions1">
          <button className="btn btn-success" onClick={handleUpdateProduct}>
            Cập nhật sản phẩm
          </button>
          <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
            Hủy
          </button>
        </div>
      </div>
    ) : addingProduct ? (
      <div className="edit-product-form">
        <h2 className="form-title">Thêm sản phẩm</h2>

        <div className="form-group">
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            value={addingProduct.name}
            onChange={(e) =>
              setAddingProduct({ ...addingProduct, name: e.target.value })
            }
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea
            value={addingProduct.description}
            onChange={(e) =>
              setAddingProduct({ ...addingProduct, description: e.target.value })
            }
            placeholder="Nhập mô tả"
          />
        </div>

        <div className="form-group">
          <label>Giá:</label>
          <input
            type="number"
            value={addingProduct.price}
            onChange={(e) =>
              setAddingProduct({ ...addingProduct, price: e.target.value })
            }
            placeholder="Nhập giá"
          />
        </div>

        <div className="form-group">
          <label>Hình ảnh:</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {images.map((img, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={img}
                  alt={`Ảnh ${index + 1}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            {images.length < 5 && (
              <>
                <button type="button" onClick={handleAddImageLink}>+ Thêm từ link</button>
                <label style={{ cursor: 'pointer', background: '#eee', padding: '6px 12px', borderRadius: '4px' }}>
                  + Tải ảnh từ máy
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Danh mục:</label>
          <select
            value={addingProduct.category || ''}
            onChange={(e) =>
              setAddingProduct({ ...addingProduct, category: e.target.value })
            }
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Giảm giá (%):</label>
          <input
            type="number"
            value={addingProduct.discount || ''}
            onChange={(e) =>
              setAddingProduct({ ...addingProduct, discount: e.target.value })
            }
            placeholder="Nhập giảm giá"
          />
        </div>

        <div className="form-group">
          <label>Số lượng:</label>
          <input
            type="number"
            value={addingProduct.quantity || ''}
            onChange={(e) =>
              setAddingProduct({ ...addingProduct, quantity: e.target.value })
            }
            placeholder="Nhập số lượng"
          />
        </div>

        <div className="form-actions1">
          <button className="btn btn-success" onClick={() => handleSaveNewProduct(addingProduct)}>
            Thêm sản phẩm
          </button>
          <button className="btn btn-secondary" onClick={() => setAddingProduct(null)}>
            Hủy
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="add0">
          <button className="add" onClick={handleAddProductClick}>
            <FaPlus />
          </button>
        </div>

        {productList.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          <div className="sp-list">
            {productList.map((product) => {
              const imageSrc = product.images?.[0]?.image || '/images/default.jpg';


              return (
                <div key={product._id || Math.random()} className="sp-card">
                  <div className="sp-info">
                    <img src= {encodeURI(imageSrc)} alt={product.name} className="image" />
                    <div className="sp-content">
                      <h3 className="sp-name">{product.name || 'Sản phẩm không tên'}</h3>
                      <p><strong>Giá:</strong> {product.price?.toLocaleString() || 0}đ</p>
                      <p><strong>Mô tả:</strong> {product.description || 'Không có mô tả'}</p>
                      <p><strong>Danh mục:</strong> {product.categories?.name || 'Không có'}</p>
                    </div>
                  </div>
                  <div className="sp-actions">
                    <button className="sp-btn-edit" onClick={() => handleEditProduct(product)}>Sửa</button>
                    <button className="sp-btn-delete" onClick={() => handleDeleteProduct(product._id)}>Xoá</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
  </div>
);
};

export default ProductManagement;