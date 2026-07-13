interface PagePlaceholderProps {
  title: string;
  description: string;
}

/** Stub screen for routes whose features land in Phase 2. The route, navigation
 *  entry, and header behaviour are real; only the content is pending. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col gap-4 py-6">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="rounded-(--radius-card) border border-dashed border-border bg-surface p-5">
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}
