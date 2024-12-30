import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { adminRoutes } from "@/routes/admin";
import { publicRoutes } from "@/routes/public";
import { shopRoutes } from "@/routes/shop";
import { accountRoutes } from "@/routes/account";
import { vendorRoutes } from "@/routes/vendor";
import { policyRoutes } from "@/routes/policy";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      ...publicRoutes,
      ...shopRoutes,
      ...accountRoutes,
      ...adminRoutes,
      ...vendorRoutes,
      ...policyRoutes
    ]
  }
]);