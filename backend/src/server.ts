import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const app = buildApp();

try {
  const url = await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });

  app.log.info(`Server listening at ${url}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
