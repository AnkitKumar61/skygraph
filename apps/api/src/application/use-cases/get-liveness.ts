import type { LivenessResponse } from "@skygraph/shared-types";

import type { Clock } from "../ports/clock.js";

export class GetLiveness {
  constructor(private readonly clock: Clock) {}

  execute(): LivenessResponse {
    return {
      status: "live",
      timestamp: this.clock.now().toISOString(),
    };
  }
}
