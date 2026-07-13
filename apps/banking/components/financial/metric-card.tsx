import { formatInrCompact } from "@/lib/formatting/format";

interface MetricCardProps {
  label: string;
  value: number;
  sublabel?: string;
}

/** ResponsiveMetricCard: same data contract on every surface; mobile shows the
 *  compact INR form. No more than three of these per visible group (F106). */
export function MetricCard({ label, value, sublabel }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-bold" aria-label={`${label}: ${formatInrCompact(value)}`}>
        {formatInrCompact(value)}
      </p>
      {sublabel ? <p className="text-xs text-muted">{sublabel}</p> : null}
    </div>
  );
}
