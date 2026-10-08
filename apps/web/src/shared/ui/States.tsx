import type { ReactNode } from "react";

export function StatePanel({
  title,
  children,
  kind = "empty",
  action,
}: {
  readonly title: string;
  readonly children: ReactNode;
  readonly kind?: "empty" | "loading" | "offline" | "error";
  readonly action?: ReactNode;
}) {
  return (
    <section
      className={`state-panel state-${kind}`}
      aria-live={kind === "empty" ? "off" : "polite"}
      role={kind === "loading" ? "status" : undefined}
    >
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </section>
  );
}
