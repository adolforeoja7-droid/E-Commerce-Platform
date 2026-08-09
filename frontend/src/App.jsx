import AppRoutes from "./routes/AppRoutes";
import { useCart } from "./context/CartContext";

function App() {
  const { toast } = useCart();

  return (
    <>
      <AppRoutes />

      {toast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}

export default App;