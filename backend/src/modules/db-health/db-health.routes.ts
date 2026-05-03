import type { FastifyInstance } from "fastify";

import { getDb } from "../../db/connection.js";
import { createApiResponse } from "../../shared/utils/api-response.js";
import type { IDbHealthResponse } from "./db-health.models.js";

export async function dbHealthRoutes(app: FastifyInstance) {
  app.get("/api/db/health", async () => {
    getDb().prepare("SELECT 1 AS ok").get();

    return createApiResponse<IDbHealthResponse>("OK", "Database health check passed.", {
      status: "ok",
      database: "sqlite",
    });
  });
}
