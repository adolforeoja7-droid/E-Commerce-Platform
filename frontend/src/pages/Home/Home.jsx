import Layout from "../../components/layout/Layout";
import Hero from "../../components/common/Hero";
import FeaturedProducts from "../../components/sections/FeaturedProducts";
import Categories from "../../components/sections/Categories";
import PromoBanner from "../../components/sections/PromoBanner";
import BestSellers from "../../components/sections/BestSellers";

function Home() {
  return (
    <Layout>
      <Hero />

      <FeaturedProducts />

      <Categories />

      <PromoBanner />

      <BestSellers />
    </Layout>
  );
}

export default Home;