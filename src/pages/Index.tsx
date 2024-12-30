import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { NewArrivals } from "@/components/NewArrivals";
import { BestSellers } from "@/components/BestSellers";
import { PromoSection } from "@/components/PromoSection";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
      <PromoSection />
      <Newsletter />
    </Layout>
  );
};

export default Index;