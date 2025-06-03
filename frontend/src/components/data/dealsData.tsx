export interface Deal {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice: number;
  image: string;
}

export const dealsData: Deal[] = [
  {
    id: 1,
    name: "Seeds of Change Organic Quinoa, Brown, & Red Rice",
    brand: "NestFood",
    price: 32.85,
    oldPrice: 33.8,
    image: "https://i.ibb.co/fxr1bLt/product-1.jpg",
  },
  {
    id: 2,
    name: "Perdue Simply Smart Organics Gluten Free",
    brand: "Old El Paso",
    price: 24.85,
    oldPrice: 26.8,
    image: "https://i.ibb.co/4mJ5VvK/product-2.jpg",
  },
  {
    id: 3,
    name: "Signature Wood-Fired Mushroom and Caramelized",
    brand: "Progresso",
    price: 12.85,
    oldPrice: 13.8,
    image: "https://i.ibb.co/vHYW5F7/product-3.jpg",
  },
  {
    id: 4,
    name: "Simply Lemonade with Raspberry Juice",
    brand: "Yoplait",
    price: 15.85,
    oldPrice: 16.8,
    image: "https://i.ibb.co/YkGkYrh/product-4.jpg",
  }
];
