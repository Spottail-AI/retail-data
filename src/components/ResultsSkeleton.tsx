import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ResultsSkeletonProps {
  message?: string;
}

export const ResultsSkeleton = ({ message = "Loading your results..." }: ResultsSkeletonProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-10 w-48 rounded-full bg-card" />
          </div>
          <Skeleton className="h-10 w-80 mx-auto mb-4 bg-card" />
          <Skeleton className="h-6 w-64 mx-auto bg-card" />
        </div>

        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-56 rounded-full bg-card" />
        </div>

        <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm animate-pulse">{message}</p>
        </div>

        <div className="space-y-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card border-border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Skeleton className="h-5 w-8 rounded bg-muted" />
                    <Skeleton className="h-5 w-48 bg-muted" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2 bg-muted" />
                  <Skeleton className="h-4 w-3/4 mb-3 bg-muted" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3.5 w-24 bg-muted" />
                    <Skeleton className="h-3.5 w-24 bg-muted" />
                    <Skeleton className="h-3.5 w-20 bg-muted" />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <Skeleton className="h-6 w-20 mb-2 bg-muted" />
                  <Skeleton className="h-4 w-24 bg-muted" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
