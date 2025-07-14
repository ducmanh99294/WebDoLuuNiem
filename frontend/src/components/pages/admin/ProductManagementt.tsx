import { useEffect, useState } from "react";

const ProductManagement = () => {
  const [productList, setProductList] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    description: "",
    categories: "",
    discount: 0,
    quantity: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:3000/api/v1/categories");
      const data = await res.json();
      const validCategories = data.data.filter((cat: any) => cat && cat.name);
      setCategories(validCategories);
    };
    fetchCategories();
  }, []);

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
        setProductList(data.products || []);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      }
    };
    fetchProductList();
  }, []);

const handleAddImageLink = () => {
  if (imageFiles.length + imageLinks.length >= 5)
    return alert("Chỉ được chọn tối đa 5 ảnh.");

  const link = prompt("Nhập link hình ảnh:");
  if (link) setImageLinks((prev) => [...prev, link]);
};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const fileArr = Array.from(files);
  if (imageFiles.length + imageLinks.length + fileArr.length > 5) {
    return alert("Chỉ được chọn tối đa 5 ảnh.");
  }

  const newUrls: string[] = [];
  const newFiles: File[] = [];

  fileArr.forEach((file) => {
    const url = URL.createObjectURL(file);
    newUrls.push(url);
    newFiles.push(file);
  });

  setImageFiles((prev) => [...prev, ...newFiles]);
  setImageLinks((prev) => [...prev, ...newUrls]);
};

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
    setProductData({
      name: "",
      price: 0,
      description: "",
      categories: "",
      discount: 0,
      quantity: 0,
    });
    setImages([]);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
    setProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      categories: product.categories?._id || "",
      discount: product.discount,
      quantity: product.quantity,
    });
    setImages(product.images.map((img: any) => img.image));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setProductData({
      name: "",
      price: 0,
      description: "",
      categories: "",
      discount: 0,
      quantity: 0,
    });
    setImages([]);
  };

const handleSave = async () => {
  if (!productData.name.trim()) return alert("Nhập tên sản phẩm");
  if (productData.price <= 0) return alert("Giá phải lớn hơn 0");
  if (!productData.categories) return alert("Chọn danh mục");
  if (imageFiles.length + imageLinks.length === 0)
    return alert("Thêm ít nhất 1 ảnh");

  const token = localStorage.getItem("token");
  if (!token) return alert("Bạn cần đăng nhập");

  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("price", String(productData.price));
  formData.append("description", productData.description);
  formData.append("discount", String(productData.discount));
  formData.append("quantity", String(productData.quantity));
  formData.append("categories", productData.categories);

  // 🖼️ Ảnh file
  imageFiles.forEach((file) => {
    formData.append("image", file);
  });

  // 🌐 Ảnh từ link
  imageLinks.forEach((url) => {
    formData.append("images", url);
  });

  try {
    const res = await fetch("http://localhost:3000/api/v1/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Thêm sản phẩm thành công");
      setProductList((prev) => [...prev, data.data]);
      handleCancel();
    } else {
      alert("Lỗi thêm sản phẩm: " + data.message);
    }
  } catch (err) {
    console.error("Lỗi:", err);
    alert("Lỗi hệ thống khi tạo sản phẩm");
  }
};


  const handleDeleteProduct = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập");
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Xóa thành công");
        setProductList((prev) => prev.filter((p) => p._id !== productId));
      } else {
        alert("Xóa thất bại: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Lỗi hệ thống khi xóa");
    }
  };

  return (
    <div className="sp-section">
      {!showForm && (
        <div className="add0">
          <button className="add" onClick={handleAddClick}>
            +
          </button>
        </div>
      )}

      {showForm && (
        <div className="edit-product-form">
          <h2 className="form-title">
            {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </h2>

          {/* Tên sản phẩm */}
          <div className="form-group">
            <label>Tên sản phẩm:</label>
            <input
              type="text"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          {/* Mô tả */}
          <div className="form-group">
            <label>Mô tả:</label>
            <textarea
              value={productData.description}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  description: e.target.value,
                })
              }
              placeholder="Nhập mô tả"
            />
          </div>

          {/* Giá */}
          <div className="form-group">
            <label>Giá:</label>
            <input
              type="number"
              value={productData.price}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  price: Number(e.target.value),
                })
              }
              placeholder="Nhập giá"
            />
          </div>

          {/* Hình ảnh */}
          <div className="form-group">
            <label>Hình ảnh:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {imageLinks.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={`Ảnh ${index + 1}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              {imageFiles.length + imageLinks.length < 5 && (
                <>
                  <button type="button" onClick={handleAddImageLink}>
                    + Thêm từ link
                  </button>
                  <label
                    style={{
                      cursor: "pointer",
                      background: "#eee",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                  >
                    + Tải ảnh từ máy
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Danh mục */}
          <div className="form-group">
            <label>Danh mục:</label>
            <select
              value={productData.categories || ''}
              onChange={(e) =>
                setProductData({ ...productData, categories: e.target.value})
              }
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Giảm giá */}
          <div className="form-group">
            <label>Giảm giá (%):</label>
            <input
              type="number"
              value={productData.discount}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  discount: Number(e.target.value),
                })
              }
              placeholder="Nhập giảm giá"
            />
          </div>

          {/* Số lượng */}
          <div className="form-group">
            <label>Số lượng:</label>
            <input
              type="number"
              value={productData.quantity}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  quantity: Number(e.target.value),
                })
              }
              placeholder="Nhập số lượng"
            />
          </div>

          <div className="form-actions1">
            <button className="btn btn-success" onClick={handleSave}>
              {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="sp-list">
        {productList.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          productList.map((product) => (
            <div key={product._id} className="sp-card">
              <div className="sp-info">
                <img
                  src={product.images[0]?.image}
                  alt={product.name}
                  className="image"
                />
                <div className="sp-content">
                  <h3 className="sp-name">{product.name}</h3>
                  <p>
                    <strong>Giá:</strong> {product.price}đ
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {product.description}
                  </p>
                  <p>
                    <strong>Danh mục:</strong> {product.categories?.name}
                  </p>
                </div>
              </div>
              <div className="sp-actions">
                <button
                  className="sp-btn-edit"
                  onClick={() => handleEditProduct(product)}
                >
                  Sửa
                </button>
                <button
                  className="sp-btn-delete"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
