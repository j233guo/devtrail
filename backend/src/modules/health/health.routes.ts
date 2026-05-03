import type { FastifyInstance } from "fastify";

import { createApiResponse } from "../../shared/utils/api-response.js";
import type { IHealthResponse } from "./health.models.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/api/health", async () =>
    createApiResponse<IHealthResponse>("OK", "Backend health check passed.", {
      status: "ok",
      service: "devtrail-backend",
    }),
  );
}
