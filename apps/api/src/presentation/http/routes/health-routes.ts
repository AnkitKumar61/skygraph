import { Router } from "express";

import type { GetLiveness } from "../../../application/use-cases/get-liveness.js";
import type { GetReadiness } from "../../../application/use-cases/get-readiness.js";
import { ApplicationError } from "../../../domain/errors/application-error.js";

export function createHealthRouter(getLiveness: GetLiveness, getReadiness: GetReadiness): Router {
  const router = Router();

  router.get("/live", (_request, response) => {
    response.status(200).json(getLiveness.execute());
  });

  router.get("/ready", async (_request, response) => {
    const result = await getReadiness.execute();
    response.status(result.status === "ready" ? 200 : 503).json(result);
  });

  router.all(["/live", "/ready"], () => {
    throw new ApplicationError({
      category: "method_not_allowed",
      code: "METHOD_NOT_ALLOWED",
      message: "The requested method is not allowed for this resource.",
    });
  });

  return router;
}
