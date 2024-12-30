import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { shopRoutes } from "./routes/shop";
import { publicRoutes } from "./routes/public";
import { adminRoutes } from "./routes/admin";
import { vendorRoutes } from "./routes/vendor";
import { accountRoutes } from "./routes/account";
import { policyRoutes } from "./routes/policy";

export const router = createBrowserRouter([
  {
    element: <Layout><Outlet /></Layout>,
    children: [
      ...publicRoutes,
      ...shopRoutes,
      adminRoutes,
      vendorRoutes,
      ...accountRoutes,
      ...policyRoutes,
    ],
  },
]);