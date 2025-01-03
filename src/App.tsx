import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Routes />
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;