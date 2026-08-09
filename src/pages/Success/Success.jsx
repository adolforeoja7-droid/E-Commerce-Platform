import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">

      <div className="text-green-500 text-6xl mb-4">
        ✔
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Order Successful!
      </h1>

      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order is being processed.
      </p>

      <Link
        to="/products"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Continue Shopping
      </Link>

    </div>
  );
}

export default Success;