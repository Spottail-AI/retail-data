import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ResultsSkeletonProps {
  message?: string;
}

export const ResultsSkeleton = ({ message = "Loading your results..." }: ResultsSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      {/* Logo */}
      <Link to="/" className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png" 
            alt="Spottail" 
            className="h-8"
          />
        </div>
      </Link>

      <div className="max-w-4xl mx-auto pt-16">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-10 w-48 rounded-full" />
          </div>
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        {/* Status indicator skeleton */}
        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-56 rounded-full" />
        </div>

        {/* Loading message */}
        <div className="text-center mb-6">
          <p className="text-slate-500 text-sm animate-pulse">{message}</p>
        </div>

        {/* Result cards skeleton */}
        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-sm border-slate-200/50 p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Skeleton className="h-6 w-8 rounded" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <Skeleton className="h-7 w-20 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
