import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./config/env.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  void app.register(cors, {
    origin: env.FRONTEND_ORIGIN,
  });

  app.get("/api/health", async () => ({
    status: "ok",
    service: "devtrail-backend",
  }));

  return app;
}
