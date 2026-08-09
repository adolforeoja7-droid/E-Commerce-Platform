import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Admin from "../pages/Admin/Admin";
import Success from "../pages/Success/Success";
import ProtectedRoute from "./ProtectedRoute";
import MyOrders from "../pages/MyOrders/MyOrders";
import AdminOrders from "../pages/AdminOrders/AdminOrders";
import Wishlist from "../pages/Wishlist/Wishlist";

function AppRoutes() {
  return (
    <Routes>

      {/* MAIN SHOP */}
      <Route
        path="/"
        element={<Products />}
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      {/* CART */}
      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      {/* AUTH */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* USER */}
      <Route
        path="/my-orders"
        element={<MyOrders />}
      />

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        }
      />

      {/* SUCCESS */}
      <Route
        path="/success"
        element={<Success />}
      />

    </Routes>
  );
}

export default AppRoutes;