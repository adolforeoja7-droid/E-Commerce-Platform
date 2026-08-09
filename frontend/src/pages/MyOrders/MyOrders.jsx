import { useEffect, useState } from "react";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/my-orders");

      console.log("ORDERS:", res.data);

      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Place your first order.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="text-gray-500">
                      {order.created_at}
                    </p>
                  </div>

                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => {
                    console.log("ITEM:", item);
                    console.log("PRICE:", item.price);

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b pb-4"
                      >
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {item.product_name}
                          </h3>

                          <p>
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Price
                          </p>

                          <p className="text-xl font-bold text-blue-600">
                            ₱{Number(item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6 text-xl font-bold">
                  <span>Total</span>

                  <span>
                    ₱{Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyOrders;