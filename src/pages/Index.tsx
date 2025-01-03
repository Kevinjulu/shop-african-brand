import { Hero } from "@/components/Hero";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { NewArrivals } from "@/components/NewArrivals";
import { BestSellers } from "@/components/BestSellers";
import { PromoSection } from "@/components/PromoSection";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
      <PromoSection />
      <Newsletter />
    </>
  );
};

export default Index;