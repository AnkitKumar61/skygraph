export const API_VERSION = "v1" as const;

export type ApiVersion = typeof API_VERSION;

export interface LivenessResponse {
  readonly status: "live";
  readonly timestamp: string;
}

export interface ReadinessComponent {
  readonly available: boolean;
}

export interface ReadinessResponse {
  readonly status: "ready" | "not_ready";
  readonly timestamp: string;
  readonly components: Readonly<Record<string, ReadinessComponent>>;
}

export interface ErrorEnvelope {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Readonly<Record<string, string | readonly string[]>>;
  };
}
