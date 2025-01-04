import { Route, Routes as RouterRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "@/components/Layout";
import { LoadingFallback } from "@/utils/withSuspense";
import { adminRoutes } from "@/routes/admin";

// Lazy load pages with proper error boundaries and absolute imports
const Home = lazy(() => import("@/pages/Home").catch(() => {
  console.error("Error loading Home page");
  return import("@/pages/NotFound");
}));

const Products = lazy(() => import("@/pages/Products").catch(() => {
  console.error("Error loading Products page");
  return import("@/pages/NotFound");
}));

const ProductDetail = lazy(() => import("@/pages/ProductDetail").catch(() => {
  console.error("Error loading ProductDetail page");
  return import("@/pages/NotFound");
}));

const Cart = lazy(() => import("@/pages/Cart").catch(() => {
  console.error("Error loading Cart page");
  return import("@/pages/NotFound");
}));

const Checkout = lazy(() => import("@/pages/Checkout").catch(() => {
  console.error("Error loading Checkout page");
  return import("@/pages/NotFound");
}));

const OrderHistory = lazy(() => import("@/pages/OrderHistory").catch(() => {
  console.error("Error loading OrderHistory page");
  return import("@/pages/NotFound");
}));

const Account = lazy(() => import("@/pages/Account").catch(() => {
  console.error("Error loading Account page");
  return import("@/pages/NotFound");
}));

const Wishlist = lazy(() => import("@/pages/Wishlist").catch(() => {
  console.error("Error loading Wishlist page");
  return import("@/pages/NotFound");
}));

const About = lazy(() => import("@/pages/About").catch(() => {
  console.error("Error loading About page");
  return import("@/pages/NotFound");
}));

const Contact = lazy(() => import("@/pages/Contact").catch(() => {
  console.error("Error loading Contact page");
  return import("@/pages/NotFound");
}));

const Auth = lazy(() => import("@/pages/Auth").catch(() => {
  console.error("Error loading Auth page");
  return import("@/pages/NotFound");
}));

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
      {adminRoutes}
      
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