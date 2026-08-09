import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart, showToast } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(false);

  // =========================
  // CHECK WISHLIST
  // =========================

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await api.get("/wishlist");

        const exists = res.data.some(
          (item) => item.product_id === product.id
        );

        setIsWishlisted(exists);
      } catch (err) {
        console.error("Wishlist check error:", err);
      }
    };

    checkWishlist();
  }, [product.id]);

  // =========================
  // TOGGLE WISHLIST
  // =========================

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login first.");
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product.id}`);

        setIsWishlisted(false);

        showToast("Removed from wishlist ❤️");
      } else {
        await api.post("/wishlist", {
          product_id: product.id,
        });

        setIsWishlisted(true);

        showToast("Added to wishlist ❤️");
      }
    } catch (err) {
      console.error("Wishlist error:", err);

      showToast(
        err.response?.data?.message ||
        "Wishlist action failed."
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition">

      {/* IMAGE */}

      <div className="relative overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-cover hover:scale-105 transition duration-300"
        />

        {/* HEART */}

        <button
          type="button"
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-3 rounded-full shadow transition ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          <FiHeart
            className={isWishlisted ? "fill-current" : ""}
          />
        </button>

      </div>

      {/* PRODUCT INFO */}

      <div className="p-5">

        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          {product.name}
        </h3>

        <p className="text-yellow-500 mt-2">
          ⭐ {product.rating}
        </p>

        <div className="flex justify-between items-center mt-4">

          <span className="text-2xl font-bold text-blue-600">
            ₱{product.price}
          </span>

          <button
            type="button"
            onClick={() => {
            const token = localStorage.getItem("token");

          if (!token) {
          navigate("/login");
          return;
         }

  addToCart(product);
}}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FiShoppingCart />
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;