import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar/Navbar";
import { Footer } from "./Footer";

export const Layout = () => {
  console.log("Layout rendering");
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};