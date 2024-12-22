import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./contexts/CartContext";
import { router } from "./routes";
import { ErrorBoundary } from "react-error-boundary";
import { Preloader } from "./components/Preloader";
import { NewsletterPopup } from "./components/NewsletterPopup";
import { AuthProvider } from "./components/AuthProvider";

function ErrorFallback({ error }: { error: Error }) {
  console.error("Application error:", error);
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

function App() {
  console.log("App component rendering");
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Preloader />
            <RouterProvider router={router} />
            <NewsletterPopup />
            <Toaster position="top-center" />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;