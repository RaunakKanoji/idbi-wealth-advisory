import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <Link
        href="/overview"
        className="flex min-h-11 items-center rounded-(--radius-control) bg-primary px-6 font-medium text-white"
      >
        Go to your dashboard
      </Link>
    </div>
  );
}
