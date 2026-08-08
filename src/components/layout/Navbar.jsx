import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const { cartItems } = useCart();
  const { darkMode, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold text-blue-600"
        >
          ShopSphere
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 w-80 lg:w-96">
          <FiSearch className="text-gray-500 dark:text-gray-300" />

          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none ml-3 w-full text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 font-medium">
          <Link
            to="/"
            className="hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-blue-600 transition"
          >
            Products
          </Link>

          <Link
            to="/categories"
            className="hover:text-blue-600 transition"
          >
            Categories
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6 text-xl md:text-2xl">

          {/* Dark Mode */}
          <button
            onClick={toggleTheme}
            className="hover:text-yellow-500 transition"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hover:text-red-500 transition"
          >
            <FiHeart />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-blue-600 transition"
          >
            <FiShoppingCart />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login */}
          <Link
            to="/admin"
            className="hidden sm:block hover:text-blue-600 transition"
          >
            <FiUser />
          </Link>

          {/* Mobile Menu */}
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>

        </div>

      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">

          <FiSearch className="text-gray-500 dark:text-gray-300" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 w-full text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white dark:bg-gray-900 dark:border-gray-700 shadow-md">

          <nav className="flex flex-col p-4 space-y-4 font-medium">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>

            <Link
              to="/categories"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
            >
              Cart ({cartCount})
            </Link>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

          </nav>

        </div>
      )}
    </header>
  );
}

export default Navbar;