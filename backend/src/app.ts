import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./config/env.js";
import { dbHealthRoutes } from "./modules/db-health/db-health.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  void app.register(cors, {
    origin: env.FRONTEND_ORIGIN,
  });

  void app.register(healthRoutes);
  void app.register(dbHealthRoutes);

  return app;
}
