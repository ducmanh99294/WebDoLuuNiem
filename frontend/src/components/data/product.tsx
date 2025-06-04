// src/data/productData.ts

export type Product = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  rating: number;
  price: number;
  discount: number;
  image: string;
  like_count: number;
  quantity: number;
  view_count: number;
  sell_count: number;
  create_At: string;
  update_At: string;
  is_delete: boolean;
  status: string;
};

export const products: Product[] = [
  {
    id: 1,
    category_id: 3,
    name: "Bánh Mì Thịt Nướng",
    description: "Bánh mì giòn rụm với thịt nướng thơm lừng và rau sống tươi ngon.",
    rating: 4.7,
    price: 25000,
    discount: 10,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 135,
    quantity: 50,
    view_count: 1200,
    sell_count: 300,
    create_At: "2024-12-01T10:30:00Z",
    update_At: "2025-05-20T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  {
    id: 2,
    category_id: 4,
    name: "Sản phẩm khác",
    description: "Mô tả sản phẩm khác...",
    rating: 4.2,
    price: 30000,
    discount: 5,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 80,
    quantity: 20,
    view_count: 900,
    sell_count: 150,
    create_At: "2024-10-01T10:30:00Z",
    update_At: "2025-05-01T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  {
    id: 3,
    category_id: 4,
    name: "Sản phẩm khác",
    description: "Mô tả sản phẩm khác...",
    rating: 4.2,
    price: 30000,
    discount: 5,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 80,
    quantity: 20,
    view_count: 900,
    sell_count: 150,
    create_At: "2024-10-01T10:30:00Z",
    update_At: "2025-05-01T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  {
    id: 4,
    category_id: 4,
    name: "Sản phẩm khác",
    description: "Mô tả sản phẩm khác...",
    rating: 4.2,
    price: 30000,
    discount: 5,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 80,
    quantity: 20,
    view_count: 900,
    sell_count: 150,
    create_At: "2024-10-01T10:30:00Z",
    update_At: "2025-05-01T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  {
    id: 5,
    category_id: 4,
    name: "Sản phẩm khác",
    description: "Mô tả sản phẩm khác...",
    rating: 4.2,
    price: 30000,
    discount: 5,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 80,
    quantity: 20,
    view_count: 900,
    sell_count: 150,
    create_At: "2024-10-01T10:30:00Z",
    update_At: "2025-05-01T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  {
    id: 6,
    category_id: 4,
    name: "Sản phẩm khác",
    description: "Mô tả sản phẩm khác...",
    rating: 4.2,
    price: 30000,
    discount: 5,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 80,
    quantity: 20,
    view_count: 900,
    sell_count: 150,
    create_At: "2024-10-01T10:30:00Z",
    update_At: "2025-05-01T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  {
    id: 7,
    category_id: 4,
    name: "Sản phẩm khác",
    description: "Mô tả sản phẩm khác...",
    rating: 4.2,
    price: 30000,
    discount: 5,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 80,
    quantity: 20,
    view_count: 900,
    sell_count: 150,
    create_At: "2024-10-01T10:30:00Z",
    update_At: "2025-05-01T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  {
    id: 8,
    category_id: 4,
    name: "Sản phẩm khác",
    description: "Mô tả sản phẩm khác...",
    rating: 4.2,
    price: 30000,
    discount: 5,
    image: './images/anh_sp/div.product-img-action-wrap.png',
    like_count: 80,
    quantity: 20,
    view_count: 900,
    sell_count: 150,
    create_At: "2024-10-01T10:30:00Z",
    update_At: "2025-05-01T08:15:00Z",
    is_delete: false,
    status: "available"
  },
  // ... các sản phẩm khác tương tự
];
