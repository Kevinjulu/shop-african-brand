import { Route, Routes as RouterRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "@/components/Layout";
import { LoadingFallback } from "@/utils/withSuspense";
import { adminRoutes } from "@/routes/admin";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderHistory = lazy(() => import("@/pages/OrderHistory"));
const Account = lazy(() => import("@/pages/Account"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Auth = lazy(() => import("@/pages/Auth"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Wrap component with Suspense and error handling
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const Routes = () => {
  console.log("Routes rendering");
  
  return (
    <RouterRoutes>
      {/* Admin routes */}
      {adminRoutes.map((route) => route)}
      
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route index element={withSuspense(Home)} />
        <Route path="products" element={withSuspense(Products)} />
        <Route path="product/:id" element={withSuspense(ProductDetail)} />
        <Route path="cart" element={withSuspense(Cart)} />
        <Route path="checkout" element={withSuspense(Checkout)} />
        <Route path="orders" element={withSuspense(OrderHistory)} />
        <Route path="account" element={withSuspense(Account)} />
        <Route path="wishlist" element={withSuspense(Wishlist)} />
        <Route path="about" element={withSuspense(About)} />
        <Route path="contact" element={withSuspense(Contact)} />
        <Route path="auth" element={withSuspense(Auth)} />
        <Route path="*" element={withSuspense(NotFound)} />
      </Route>
    </RouterRoutes>
  );
};