import { Router } from "express";

import type { Metrics } from "../../../application/ports/metrics.js";
import { ApplicationError } from "../../../domain/errors/application-error.js";

export function createMetricsRouter(metrics: Metrics): Router {
  const router = Router();

  router.get("/", async (_request, response) => {
    response.type(metrics.contentType).send(await metrics.serialize());
  });

  router.all("/", () => {
    throw new ApplicationError({
      category: "method_not_allowed",
      code: "METHOD_NOT_ALLOWED",
      message: "The requested method is not allowed for this resource.",
    });
  });

  return router;
}
