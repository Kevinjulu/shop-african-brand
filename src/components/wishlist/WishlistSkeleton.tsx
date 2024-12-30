import { Skeleton } from "@/components/ui/skeleton";

export const WishlistSkeleton = () => {
  return (
    <div className="grid gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 border rounded-lg p-4">
          <Skeleton className="w-24 h-24 rounded-md" />
          <div className="flex-grow">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};