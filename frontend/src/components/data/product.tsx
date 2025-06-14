// src/data/productData.ts

interface Image {
  _id: number;
  image: string;
};

export type Product = {
  _id: number;
  category_id: number;
  name: string;
  description: string;
  rating: number;
  price: number;
  discount: number;
  images: Image[];
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
    _id: 1,
    category_id: 101,
    name: 'Sản phẩm A',
    description: 'Mô tả sản phẩm A',
    rating: 4.5,
    price: 500000,
    discount: 10,
    images: [
      { _id: 1, image: 'https://example.com/image1.jpg' },
    ],
    like_count: 20,
    quantity: 50,
    view_count: 100,
    sell_count: 30,
    create_At: '2024-01-01',
    update_At: '2024-01-05',
    is_delete: false,
    status: 'active',
  },
  // bạn có thể thêm nhiều sản phẩm khác ở đây
];