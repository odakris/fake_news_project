import { Logger } from "tslog";
import { env } from "./env";

export const logger = new Logger({
  name: "AppLogger",
  // Don't use `env` here, because we can use the logger in the browser
  minLevel: env.NODE_ENV === "production" ? 3 : 0,
});