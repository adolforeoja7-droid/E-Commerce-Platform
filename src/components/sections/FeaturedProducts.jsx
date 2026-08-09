import { useCart } from "../../context/CartContext";
import ProductCard from "../ui/ProductCard";

function FeaturedProducts() {
  const { products } = useCart(); // 🔥 DYNAMIC DATA NA

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        ) : (
          <p className="text-gray-500 text-lg">
            No products yet
          </p>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;