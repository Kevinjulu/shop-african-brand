import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import OrderHistory from "@/pages/OrderHistory";
import VendorRegister from "@/pages/VendorRegister";
import ShippingPolicy from "@/pages/ShippingPolicy";
import ReturnsPolicy from "@/pages/ReturnsPolicy";
import Stores from "@/pages/Stores";
import Cart from "@/pages/Cart";
import BestSellers from "@/pages/BestSellers";
import OnSale from "@/pages/OnSale";
import Products from "@/pages/Products";
import Wishlist from "@/pages/Wishlist";
import NewArrivals from "@/pages/NewArrivals";
import Traditional from "@/pages/Traditional";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
    errorElement: <NotFound />,
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>,
  },
  {
    path: "/order-history",
    element: <Layout><OrderHistory /></Layout>,
  },
  {
    path: "/vendor/register",
    element: <Layout><VendorRegister /></Layout>,
  },
  {
    path: "/shipping-policy",
    element: <Layout><ShippingPolicy /></Layout>,
  },
  {
    path: "/returns-policy",
    element: <Layout><ReturnsPolicy /></Layout>,
  },
  {
    path: "/stores",
    element: <Layout><Stores /></Layout>,
  },
  {
    path: "/cart",
    element: <Layout><Cart /></Layout>,
  },
  {
    path: "/best-sellers",
    element: <Layout><BestSellers /></Layout>,
  },
  {
    path: "/on-sale",
    element: <Layout><OnSale /></Layout>,
  },
  {
    path: "/products",
    element: <Layout><Products /></Layout>,
  },
  {
    path: "/wishlist",
    element: <Layout><Wishlist /></Layout>,
  },
  {
    path: "/new-arrivals",
    element: <Layout><NewArrivals /></Layout>,
  },
  {
    path: "/traditional",
    element: <Layout><Traditional /></Layout>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);