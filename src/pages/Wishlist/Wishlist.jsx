import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function Wishlist() {
  const navigate = useNavigate();

  const { addToCart, showToast } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET WISHLIST
  // =========================

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const res = await api.get("/wishlist");

      setWishlist(res.data);
    } catch (err) {
      console.error("Error loading wishlist:", err);

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // =========================
  // REMOVE WISHLIST
  // =========================

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      setWishlist((prev) =>
        prev.filter(
          (item) => item.product_id !== productId
        )
      );

      showToast("Removed from wishlist ❤️");
    } catch (err) {
      console.error("Error removing wishlist:", err);
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (product) => {
    addToCart(product);

    showToast("Added to cart ✔");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading wishlist...
        </p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* TITLE */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <FiHeart
              className="text-red-500"
              size={30}
            />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Wishlist
            </h1>

          </div>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Products you saved for later.
          </p>

        </div>

        {/* EMPTY WISHLIST */}

        {wishlist.length === 0 ? (

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-12 text-center">

            <FiHeart
              size={60}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              You haven't added any products yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Browse Products
            </button>

          </div>

        ) : (

          /* WISHLIST PRODUCTS */

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {wishlist.map((item) => {

              const product = item.product;

              return (

                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
                >

                  {/* IMAGE */}

                  <div className="relative">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-60 object-cover"
                    />

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      className="absolute top-3 right-3 z-50 bg-white dark:bg-gray-700 text-red-500 p-3 rounded-full shadow hover:bg-red-50 transition cursor-pointer"
                    >
                      <FiTrash2 size={18} />
                    </button>

                  </div>

                  {/* PRODUCT INFO */}

                  <div className="p-5">

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>

                    <p className="text-yellow-500 mt-2">
                      ⭐ {product.rating}
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-3">
                      ₱{product.price}
                    </p>

                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                      >
                        <FiShoppingCart />
                        Add to Cart
                      </button>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Wishlist;