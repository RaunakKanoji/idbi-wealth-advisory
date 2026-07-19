const PROTOTYPE_URL = "https://appetize.io/app/b_bbr4mbuv4chb5mmb2eqspfdb5e";

export function PrototypePreview() {
  return (
    <a
      href={PROTOTYPE_URL}
      className="flex min-h-12 w-full items-center justify-center rounded-(--radius-control) border border-primary px-6 text-base font-semibold text-primary active:bg-primary-soft"
    >
      View app prototype
    </a>
  );
}
