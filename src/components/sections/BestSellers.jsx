import products from "../../data/products";
import ProductCard from "../ui/ProductCard";

function BestSellers() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      <h2 className="text-4xl font-bold mb-10">
        ⭐ Best Sellers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default BestSellers;