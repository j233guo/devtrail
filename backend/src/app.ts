import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./config/env.js";
import { getDb } from "./db/connection.js";

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

  app.get("/api/db/health", async () => {
    getDb().prepare("SELECT 1 AS ok").get();

    return {
      status: "ok",
      database: "sqlite",
    };
  });

  return app;
}
