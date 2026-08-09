function PromoBanner() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-5xl font-bold">
          Summer Sale
        </h2>

        <p className="mt-4 text-xl">
          Up to 50% OFF on selected products.
        </p>

        <button className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Shop Deals
        </button>

      </div>
    </section>
  );
}

export default PromoBanner;