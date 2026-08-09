import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">

          <div className="text-6xl mb-4">🛒</div>

          <h2 className="text-2xl font-bold mb-2">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mb-6">
            please add products
          </p>

          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </a>

        </div>
      ) : (
        <div className="space-y-6">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow p-4 rounded-lg"
            >

              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-blue-600 font-bold">
                    ${item.price}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  -
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                Remove
              </button>

            </div>
          ))}

          {/* TOTAL SECTION */}
          <div className="text-right text-2xl font-bold mt-8">
            Total: ${totalPrice.toFixed(2)}
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition"
          >
            Checkout
          </button>

        </div>
      )}
    </div>
  );
}

export default Cart;