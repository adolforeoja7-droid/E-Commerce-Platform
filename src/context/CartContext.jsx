import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ==========================
  // CART
  // ==========================

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ==========================
  // PRODUCTS
  // ==========================

  const [products, setProducts] = useState([]);

  // ==========================
  // WISHLIST
  // ==========================

  const [wishlist, setWishlist] = useState([]);

  // ==========================
  // TOAST
  // ==========================

  const [toast, setToast] = useState("");

  // ==========================
  // FETCH PRODUCTS
  // ==========================

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");

      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  // ==========================
  // FETCH WISHLIST
  // ==========================

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const res = await api.get("/wishlist");

      setWishlist(res.data);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  // ==========================
  // LOAD DATA
  // ==========================

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  // ==========================
  // SAVE CART
  // ==========================

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // ==========================
  // TOAST
  // ==========================

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  // ==========================
  // ADD TO CART
  // ==========================

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    showToast("Added to cart ✔");
  };

  // ==========================
  // ADD TO WISHLIST
  // ==========================

  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login first ❤️");
      return;
    }

    try {
      const res = await api.post("/wishlist", {
        product_id: product.id,
      });

      setWishlist((prev) => [
        ...prev,
        res.data.wishlist,
      ]);

      showToast("Added to wishlist ❤️");
    } catch (err) {
      console.error("Error adding to wishlist:", err);

      if (
        err.response?.data?.message ===
        "Product already in wishlist."
      ) {
        showToast("Already in wishlist ❤️");
      } else {
        showToast("Failed to add wishlist");
      }
    }
  };

  // ==========================
  // REMOVE FROM WISHLIST
  // ==========================

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(
        `/wishlist/${productId}`
      );

      setWishlist((prev) =>
        prev.filter(
          (item) =>
            item.product_id !== productId
        )
      );

      showToast("Removed from wishlist 💔");
    } catch (err) {
      console.error(
        "Error removing from wishlist:",
        err
      );

      showToast("Failed to remove wishlist");
    }
  };

  // ==========================
  // PROVIDER
  // ==========================

  return (
    <CartContext.Provider
      value={{
        // Cart
        cartItems,
        setCartItems,
        addToCart,

        // Products
        products,
        setProducts,
        fetchProducts,

        // Wishlist
        wishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,

        // Toast
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () =>
  useContext(CartContext);