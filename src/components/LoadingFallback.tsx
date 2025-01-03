import { Loader2 } from "lucide-react";

export const LoadingFallback = () => {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};