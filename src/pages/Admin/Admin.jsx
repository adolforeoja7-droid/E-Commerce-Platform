import { useState } from "react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function Admin() {
  const { products, fetchProducts } = useCart();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState(null);

  // ==========================
  // UPLOAD IMAGE TO FLASK
  // ==========================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImage(res.data.image);
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    }
  };

  // ==========================
  // CLEAR FORM
  // ==========================
  const clearForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setCategory("Electronics");
    setRating(5);
    setImage("");
  };

  // ==========================
  // ADD / UPDATE PRODUCT
  // ==========================
  const saveProduct = async () => {
    if (!name || !price || !image) {
      alert("Please complete all fields.");
      return;
    }

    const product = {
      name,
      price: parseFloat(price),
      category,
      image,
      rating: parseFloat(rating),
    };

    try {
      if (editId) {
        await api.put(`/products/${editId}`, product);
        alert("Product Updated!");
      } else {
        await api.post("/products", product);
        alert("Product Added!");
      }

      await fetchProducts();

      clearForm();
    } catch (err) {
      console.error(err);

      console.log("Status:", err.response?.status);
  console.log("Data:", err.response?.data);

      alert(
        err.response?.data?.message ||
         JSON.stringify(err.response?.data) ||
         "Error saving product.");
    }
  };

  // ==========================
  // EDIT PRODUCT
  // ==========================
  const editProduct = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image);
    setRating(product.rating);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);

      await fetchProducts();

      alert("Product Deleted!");

      if (editId === id) {
        clearForm();
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

    return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 text-gray-900 dark:text-white">

      <h1 className="text-4xl font-bold mb-8">
        Admin Panel
      </h1>

      {/* FORM */}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          >
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Sports">Sports</option>
          </select>

          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />

        </div>

        <div className="mt-5">

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />

        </div>

        {image && (
          <img
            src={image}
            alt="Preview"
            className="mt-5 w-44 h-44 rounded-lg object-cover border"
          />
        )}

        <div className="flex flex-wrap gap-4 mt-6">

          <button
            onClick={saveProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            {editId ? "Update Product" : "Add Product"}
          </button>

          <button
            onClick={clearForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
          >
            Clear
          </button>

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {products.length > 0 ? (

          products.map((product) => (

            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            >

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-bold">
                  {product.name}
                </h2>

                <p className="text-blue-600 font-bold text-lg mt-2">
                  ₱{product.price}
                </p>

                <p className="text-gray-500 dark:text-gray-300">
                  {product.category}
                </p>

                <p className="mt-2">
                  ⭐ {product.rating}
                </p>

                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() => editProduct(product)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="col-span-full text-center py-20 text-gray-500">

            <h2 className="text-2xl font-semibold">
              No products found
            </h2>

            <p className="mt-2">
              Add your first product above.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Admin;