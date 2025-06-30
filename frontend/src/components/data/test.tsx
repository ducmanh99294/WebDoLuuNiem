export interface Product {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  link?: string;
}

export interface User {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingStatus: string;
  user: User;
  products: Product[];
  totalAmount: number;
}

export const mockOrder: Order = {
  id: "#SF-10000052",
  createdAt: "30 Th06 2025 14:04:56",
  status: "Chờ xử lý",
  paymentMethod: "Thanh toán khi nhận hàng (COD)",
  paymentStatus: "Đang chờ xử lý",
  shippingStatus: "Pending",
  user: {
    name: "Nguyễn hòa",
    phone: "0986814490",
    address: "sad, sđ, sd, AF"
  },
  products: [
    {
      id: "MS-100",
      name: "Hạnh nhân kim cương xanh nhẹ",
      image: "https://via.placeholder.com/80",
      quantity: 1,
      price: 462.0,
      link: "/product/MS-100"
    }
  ],
  totalAmount: 462.0
};
