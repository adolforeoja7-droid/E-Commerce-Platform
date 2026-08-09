import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const discount = subtotal > 500 ? 100 : 0;

  const total = subtotal + shipping - discount;

  const handleCheckout = async () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  try {
    const items = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const res = await api.post("/checkout", {
      items,
    });

    console.log(res.data);

    alert("Order placed successfully!");

    setCartItems([]);
    localStorage.removeItem("cart");

    navigate("/success");
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Checkout failed."
    );
  }
};

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty 🛒
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 space-y-6">

          {/* ITEMS */}
          <div className="flex justify-between">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          {/* SUBTOTAL */}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* SHIPPING */}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          {/* DISCOUNT */}
          <div className="flex justify-between text-red-500">
            <span>Discount</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>

          <hr />

          {/* TOTAL */}
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">
              Payment Method
            </h2>

            <div className="space-y-3">

              {/* COD */}
              <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              {/* CARD */}
              <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit / Debit Card</span>
              </label>

            </div>
          </div>

          {/* CARD FORM (conditional) */}
          {paymentMethod === "CARD" && (
            <div className="mt-4 space-y-3 border p-4 rounded-lg bg-gray-50">

              <input
                type="text"
                placeholder="Card Number"
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 border p-2 rounded"
                />

                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 border p-2 rounded"
                />
              </div>

            </div>
          )}

          <button
            onClick={handleCheckout}

            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700"
          >
            Place Order
          </button>

        </div>
      )}
    </div>
  );
}

export default Checkout;