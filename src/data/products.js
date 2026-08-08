import headphones from "../assets/images/headphones.jpg";
import laptop from "../assets/images/laptop.jpg";
import smartwatch from "../assets/images/smartwatch.jpg";
import speaker from "../assets/images/speaker.jpg";
import shoes from "../assets/images/shoes.jpg";
import backpack from "../assets/images/backpack.jpg";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    image: headphones,
    rating: 4.8,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Gaming Laptop",
    price: 1299.99,
    image: laptop,
    rating: 4.9,
    category: "Electronics",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 199.99,
    image: smartwatch,
    rating: 4.7,
    category: "Electronics",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 79.99,
    image: speaker,
    rating: 4.6,
    category: "Electronics",
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 89.99,
    image: shoes,
    rating: 4.5,
    category: "Fashion",
  },
  {
    id: 6,
    name: "Travel Backpack",
    price: 59.99,
    image: backpack,
    rating: 4.7,
    category: "Sports",
  },
];

export default products;