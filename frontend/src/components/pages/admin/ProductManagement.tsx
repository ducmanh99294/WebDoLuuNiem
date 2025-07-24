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
import {CreateProductSuccess, DeleteProductSuccess, UpdateProductSuccess, ConfirmDeleteDialog} from '../../PaymentSuccess';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ProductManagement = () => {
  const [productList, setProductList] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [addingProduct, setAddingProduct] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>(['']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);  // ảnh từ máy
  const [imageLinks, setImageLinks] = useState<string[]>([]);  // ảnh từ link
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // hàm mở form sửa sản phẩm 
  const handleEditProduct = (product: any) => {
    setEditingProduct({ ...product });
    const imageUrls = product.images?.map((img: any) => img.image) || [];
    setImages(imageUrls);
    setImageFiles([]);
    setImageLinks([]);
};

// xử lí chọn ảnh từ máy 
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  if (imageFiles.length + imageLinks.length + files.length > 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }

  const newFiles = Array.from(files);
  setImageFiles(prev => [...prev, ...newFiles]);

  const newPreviews = newFiles.map(file => URL.createObjectURL(file));
  setImages(prev => [...prev, ...newPreviews]);
};


// xử lí xóa ảnh 
const handleRemoveImage = (index: number) => {
  setImages(prev => prev.filter((_, i) => i !== index));

  // Loại bỏ link nếu là link
  setImageLinks(prev => prev.filter((_, i) => images[i].startsWith('http') ? i !== index : true));
  
  // Loại bỏ file nếu là file (URL.createObjectURL)
  setImageFiles(prev => prev.filter((_, i) => !images[i].startsWith('blob:') || i !== index));
};


const handleAddImageLink = () => {
  if (imageFiles.length + imageLinks.length >= 5) {
    alert('Chỉ được chọn tối đa 5 ảnh.');
    return;
  }

  const link = prompt('Nhập link hình ảnh:');
  if (link) {
    setImageLinks(prev => [...prev, link]);
    setImages(prev => [...prev, link]);  
  }
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
  setImages([]);  
  setImageFiles([]);  
  setImageLinks([]); 
  fetchCategories();   // Thêm dòng này để chắc chắn danh mục được load
};

// lấy danh mục
const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/api/v1/categories', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('📂 Danh mục trả về:', data);

    if (Array.isArray(data.data)) {
      const validCategories = data.data.filter((cat: any) => cat && cat.name);
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
    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("description", editingProduct.description);
    formData.append("price", editingProduct.price);
    formData.append("quantity", editingProduct.quantity);
    formData.append("discount", editingProduct.discount);
    formData.append("category", editingProduct.categoryId);
       imageFiles.forEach((file) => {
        formData.append('images', file);
      });

       imageLinks.forEach((url) => {
        formData.append('images', url); // Backend sẽ xử lý chuỗi URL
      });

    const response = await fetch(`http://localhost:3001/api/v1/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    console.log('✅ Kết quả cập nhật:', data);

    if (response.ok) {
      setShowUpdateSuccess(true)
      setEditingProduct(null);
      setProductList((prevList) =>
        prevList.map((p) =>
          p._id === editingProduct._id ? { ...p, ...editingProduct } : p
        )
      );
      await fetchProductList();
    } else {
      alert('❌ Cập nhật thất bại: ' + (data.message || 'Lỗi không xác định'));
    }
  } catch (error) {
    console.error('🚨 Lỗi cập nhật:', error);
    alert('Đã xảy ra lỗi khi cập nhật.');
  }
};

  const confirmDelete = (productId: string) => {
  setPendingDelete(productId);
  setShowConfirmDelete(true);
};
// Hàm xoá sản phẩm khỏi hệ thống (admin only)
const handleDeleteProduct = async () => {
  if (!pendingDelete) return;

  const token = localStorage.getItem('token');

  if (!token) {
    alert('❌ Bạn cần đăng nhập với quyền Admin');
    return;
  }

  const confirmDelete = window.confirm('❗Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:3001/api/v1/products/${pendingDelete}`, {
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
      setShowDeleteSuccess(true);
      setProductList((prevList) => prevList.filter((p) => p._id !== pendingDelete));
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
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('discount', newProduct.discount);
    formData.append('quantity', newProduct.quantity);
    formData.append('rating', '0');
    formData.append('categories', newProduct.category);

    // 👇 Gửi file từ máy (blob)
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    // 👇 Gửi link (ảnh từ URL)
    imageLinks.forEach((url) => {
      formData.append('images', url); // Backend sẽ xử lý chuỗi URL
    });

    const response = await fetch(`http://localhost:3001/api/v1/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (response.ok) {
      setShowCreateSuccess(true);
      setAddingProduct(null);
      setProductList(prev => [...prev, data.data]);
      await fetchProductList();
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
            fetchProductList();
    }, []);

      const fetchProductList = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:3001/api/v1/products", {
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
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {images.map((img, index) => (
      <div key={index} style={{ position: 'relative' }}>
        <img
         src={
    img.startsWith('http') ||
    img.startsWith('blob') ||
    img.startsWith('data:image')
      ? img
      : `http://localhost:3001${img}`
  }  
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
  {images.length < 100 && (
    <>
      <label
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
        }}
      >
        + Tải ảnh từ máy
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>

      <button
        type="button"
        onClick={handleAddImageLink}
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
          border: 'none'
        }}
      >
        + Thêm từ link
      </button>
    </>
  )}
</div>

</div>


        <div className="form-group">
          <label>Danh mục:</label>
          <select
            value={editingProduct.category || ''}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, category: e.target.value })
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
            value={editingProduct.discount || ''}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, discount: e.target.value })
            }
            placeholder="Nhập giảm giá"
          />
        </div>

        <div className="form-group">
          <label>Số lượng:</label>
          <input
            type="number"
            value={editingProduct.quantity || ''}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, quantity: e.target.value })
            }
            placeholder="Nhập số lượng"
          />
        </div>

        <div className="form-actions1">
          <button className="btn btn-success" onClick={() => handleUpdateProduct()}>
            Sửa sản phẩm
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
  {images.length < 100 && (
    <>
      <label
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
        }}
      >
        + Tải ảnh từ máy
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>

      <button
        type="button"
        onClick={handleAddImageLink}
        style={{
          cursor: 'pointer',
          background: '#eee',
          padding: '6px 12px',
          borderRadius: '4px',
          border: 'none'
        }}
      >
        + Thêm từ link
      </button>
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

let imageSrc = '';

if (product.images && product.images.length > 0) {
  const firstImage = product.images[0];

  const imagePath = typeof firstImage === 'string'
    ? firstImage
    : firstImage?.image;

  if (typeof imagePath === 'string') {
    if (/^https?:\/\//.test(imagePath)) {
  imageSrc = imagePath;
} else {
  imageSrc = `http://localhost:3001${imagePath}`;
}
  
  }

}


              return (
                <div key={product._id || Math.random()} className="sp-card">
                  <div className="sp-info">
                    <img src= {imageSrc} alt={product.name} className="image" />
                    <div className="sp-content">
                      <h3 className="sp-name">{product.name || 'Sản phẩm không tên'}</h3>
                      <p><strong>Giá:</strong> {product.price?.toLocaleString() || 0}đ</p>
                      <p><strong>Mô tả:</strong> {product.description || 'Không có mô tả'}</p>
                      <p><strong>Danh mục:</strong> {product.categories?.name || 'Không có'}</p>
                    </div>
                  </div>
                  <div className="sp-actions">
                    <button className="sp-btn-edit" onClick={() => handleEditProduct(product)}>Sửa</button>
                    <button className="sp-btn-delete" onClick={() => confirmDelete(product._id)}>Xoá</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
    {showCreateSuccess && (
      <CreateProductSuccess
        message="Thêm danh mục thành công"
        description="Danh mục mới đã được tạo."
        buttonText="Đóng"
        onClose={() => setShowCreateSuccess(false)}
      />
    )}
    
    {showUpdateSuccess && (
      <UpdateProductSuccess
        message="Cập nhật danh mục thành công"
        description="Danh mục đã được chỉnh sửa."
        buttonText="Đóng"
        onClose={() => setShowUpdateSuccess(false)}
      />
    )}
    
    {showDeleteSuccess && (
      <DeleteProductSuccess
        message="Xóa danh mục thành công"
        description="Danh mục đã bị xóa khỏi hệ thống."
        buttonText="Đóng"
        onClose={() => setShowDeleteSuccess(false)}
      />
    )}
    {showConfirmDelete && (
      <ConfirmDeleteDialog
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          setShowConfirmDelete(false);
          setPendingDelete(null);
        }}
      />
    )}
  </div>
);
};

export default ProductManagement;