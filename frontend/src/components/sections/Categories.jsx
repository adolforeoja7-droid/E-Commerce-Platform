function Categories() {
  const categories = [
    "Electronics",
    "Fashion",
    "Shoes",
    "Furniture",
    "Beauty",
    "Sports",
  ];

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold mb-10">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {categories.map((category) => (
            <div
              key={category}
              className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer p-8 text-center transition"
            >
              <h3 className="font-semibold text-lg">
                {category}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Categories;