import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes />
        <Toaster />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;