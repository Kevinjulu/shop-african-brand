import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const LoadingFallback = () => {
  console.log("Showing loading fallback");
  
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <span className="text-lg text-gray-600">Loading page...</span>
      </div>
    </div>
  );
};

export const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export default LoadingFallback;