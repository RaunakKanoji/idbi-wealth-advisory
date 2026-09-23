import { appLinks } from "@/lib/app-links";

export function PrototypePreview() {
  return (
    <div className="flex w-full flex-col gap-4" aria-label="App prototypes">
      <a
        href={appLinks.prototype}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View app prototype (opens in a new tab)"
        className="flex min-h-12 w-full items-center justify-center rounded-(--radius-control) border border-primary px-6 text-base font-semibold text-primary transition-[background-color,border-color,transform] duration-200 ease-out hover:border-primary-strong hover:bg-primary-soft hover:text-primary-strong active:translate-y-px focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2"
      >
        View app prototype
      </a>
      <a
        href={appLinks.finalPrototype}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View final app prototype (opens in a new tab)"
        className="flex min-h-12 w-full items-center justify-center rounded-(--radius-control) bg-primary-strong px-6 text-base font-semibold text-white shadow-md transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-primary hover:shadow-lg active:translate-y-px focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2"
      >
        View final app prototype
      </a>
    </div>
  );
}
