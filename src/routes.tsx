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
      ...(Array.isArray(publicRoutes) ? publicRoutes : [publicRoutes]),
      ...(Array.isArray(shopRoutes) ? shopRoutes : [shopRoutes]),
      ...(Array.isArray(accountRoutes) ? accountRoutes : [accountRoutes]),
      ...(Array.isArray(adminRoutes) ? adminRoutes : [adminRoutes]),
      ...(Array.isArray(vendorRoutes) ? vendorRoutes : [vendorRoutes]),
      ...(Array.isArray(policyRoutes) ? policyRoutes : [policyRoutes])
    ]
  }
]);