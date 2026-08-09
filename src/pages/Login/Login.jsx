import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful!");

      if (res.data.user.role === "admin") {
  console.log("ADMIN LOGIN → navigating to:", "/admin");
  navigate("/admin");
} else {
  console.log("USER LOGIN → navigating to:", "/products");
  navigate("/products");
}

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Login failed."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
        Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-blue-600 hover:underline font-semibold"
          >
          Register
          </button>
        </p>

        </form>

      </div>

    </div>
  );
}

export default Login;