import { lazy, Suspense } from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import { LoadingFallback } from "@/components/LoadingFallback";
import { Layout } from "@/components/Layout";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderHistory = lazy(() => import("@/pages/OrderHistory"));
const Account = lazy(() => import("@/pages/Account"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
};

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route element={<Layout />}>
        <Route index element={withSuspense(Home)} />
        <Route path="products" element={withSuspense(Products)} />
        <Route path="product/:id" element={withSuspense(ProductDetail)} />
        <Route path="cart" element={withSuspense(Cart)} />
        <Route path="checkout" element={withSuspense(Checkout)} />
        <Route path="order-history" element={withSuspense(OrderHistory)} />
        <Route path="account" element={withSuspense(Account)} />
        <Route path="*" element={withSuspense(NotFound)} />
      </Route>
    </RouterRoutes>
  );
};