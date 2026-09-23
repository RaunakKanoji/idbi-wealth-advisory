import Link from "next/link";
import { PrototypePreview } from "@/components/prototype/prototype-preview";
import { appLinks } from "@/lib/app-links";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-6 px-6 safe-top safe-bottom">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold tracking-wide text-primary">IDBI BANK</span>
        <h1 className="text-3xl font-bold leading-tight">Wealth Copilot</h1>
        <p className="readable text-muted">
          Understand your money, track your goals, and get advice you can question — all in one
          conversation.
        </p>
      </div>
      <Link
        href={appLinks.demo}
        className="flex min-h-12 w-full items-center justify-center rounded-(--radius-control) bg-primary px-6 text-base font-semibold text-white shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-primary-strong hover:shadow-md active:translate-y-px focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2"
      >
        View app demo
      </Link>
      <PrototypePreview />
      <p className="text-xs text-muted">
        Hackathon demo environment. No real customer data is used.
      </p>
    </main>
  );
}
