import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number.parseInt(process.env.PORT ?? "3000", 10),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN ?? "http://localhost:4200",
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
