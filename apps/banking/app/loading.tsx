import { Skeleton } from "@/components/feedback/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 px-4 pt-6" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
