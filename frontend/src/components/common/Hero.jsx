import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="max-w-2xl">

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Shop Smarter,
            <br />
            Live Better.
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            Explore thousands of products from electronics, fashion,
            furniture, and more — all in one place.
          </p>

          <div className="mt-8 flex gap-4">

            <Link
              to="/products"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Shop Now
            </Link>

            <Link
              to="/register"
              className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700"
            >
              Join Now
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;