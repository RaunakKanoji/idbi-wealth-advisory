const existingPrototypeUrl = "https://appetize.io/app/b_bbr4mbuv4chb5mmb2eqspfdb5e";
const finalPrototypeUrl =
  process.env.NEXT_PUBLIC_FINAL_APP_PROTOTYPE_URL?.trim() ||
  "https://appetize.io/app/b_cyha5ltvmdh75x6brldhdghz4y";

/** Public destinations used by the landing page CTAs. */
export const appLinks = {
  demo: "/sign-in",
  prototype: existingPrototypeUrl,
  finalPrototype: finalPrototypeUrl,
} as const;
