import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import ProductCard from "../../components/ui/ProductCard";
import api from "../../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
  api.get("/products")
  .then((response) => {
    setProducts(response.data);
  })
    .catch((error) => {
      console.error(error);
    });
}, []);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts];

  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;

    case "name":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    default:
      break;
  }

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">

        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          All Products
        </h1>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">

          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-64 p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Sports">Sports</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-64 p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
            <option value="name">Name (A-Z)</option>
          </select>

        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-xl py-10">
              No products found. Add from Admin panel.
            </div>
          )}

        </div>

      </section>
    </Layout>
  );
}

export default Products;