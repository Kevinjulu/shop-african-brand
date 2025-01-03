import { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";

export const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
};