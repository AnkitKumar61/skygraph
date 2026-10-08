import type { ReactNode } from "react";

export function StatePanel({
  title,
  children,
  kind = "empty",
  action,
  headingLevel = 2,
}: {
  readonly title: string;
  readonly children: ReactNode;
  readonly kind?: "empty" | "loading" | "offline" | "error";
  readonly action?: ReactNode;
  readonly headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section
      className={`state-panel state-${kind}`}
      aria-live={kind === "empty" ? "off" : "polite"}
      role={kind === "loading" ? "status" : undefined}
    >
      <Heading>{title}</Heading>
      <p>{children}</p>
      {action}
    </section>
  );
}
