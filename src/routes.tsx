import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from "react-error-boundary";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import Account from "@/pages/Account";
import Auth from "@/pages/Auth";
import Stores from "@/pages/Stores";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import ShippingPolicy from "@/pages/ShippingPolicy";
import ReturnsPolicy from "@/pages/ReturnsPolicy";
import Careers from "@/pages/Careers";
import Affiliate from "@/pages/Affiliate";
import Terms from "@/pages/Terms";
import VendorRegister from "@/pages/VendorRegister";
import TrackOrder from "@/pages/TrackOrder";
import Admin from "@/pages/Admin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { AuthProvider } from "./components/AuthProvider";
import { CartProvider } from "./contexts/CartContext";
import { Preloader } from "./components/Preloader";
import { NewsletterPopup } from "./components/NewsletterPopup";

function ErrorFallback({ error }: { error: Error }) {
  console.error("Router error:", error);
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Preloader />
        <Layout />
        <NewsletterPopup />
      </CartProvider>
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorFallback error={new Error("Page not found")} />,
    children: [
      { index: true, element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/wishlist", element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
      { path: "/account", element: <ProtectedRoute><Account /></ProtectedRoute> },
      { path: "/auth", element: <Auth /> },
      { path: "/auth/reset-password", element: <Auth /> },
      { path: "/stores", element: <Stores /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/shipping-policy", element: <ShippingPolicy /> },
      { path: "/returns-policy", element: <ReturnsPolicy /> },
      { path: "/careers", element: <Careers /> },
      { path: "/affiliate", element: <Affiliate /> },
      { path: "/terms", element: <Terms /> },
      { path: "/vendor/register", element: <VendorRegister /> },
      { path: "/track-order", element: <TrackOrder /> },
      { path: "/admin/*", element: <AdminRoute><Admin /></AdminRoute> },
    ],
  },
]);