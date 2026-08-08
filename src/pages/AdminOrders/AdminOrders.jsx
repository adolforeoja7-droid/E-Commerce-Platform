import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });

      alert("Order updated!");

      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          Admin Orders
        </h1>

        {orders.length === 0 ? (

          <div className="text-center py-20">

            <h2 className="text-2xl font-semibold">
              No Orders
            </h2>

          </div>

        ) : (

          <div className="space-y-8">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >

                <div className="flex justify-between items-center mb-6">

                  <div>

                    <h2 className="text-xl font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="text-gray-500">
                      Customer ID: {order.user_id}
                    </p>

                    <p className="text-gray-500">
                      {order.created_at}
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>

                  </div>

                </div>

                <div className="space-y-4">

                  {order.items.map((item) => (

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
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <div className="font-bold">
                        ₱{item.price}
                      </div>

                    </div>

                  ))}

                </div>

                <div className="flex justify-between mt-6 text-xl font-bold">

                  <span>Total</span>

                  <span>
                    ₱{order.total}
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

export default AdminOrders;