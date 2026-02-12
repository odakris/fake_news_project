import { env } from "./env";

/**
 * This method return the server URL based on the environment.
 */
export const getServerUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
  
    if (env.BETTER_AUTH_URL) {
      return env.BETTER_AUTH_URL;
    }
  
    // If we are in production, we return the production URL.
    if (process.env.VERCEL_ENV === "production") {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
  
    // If we are in "stage" environment, we return the staging URL.
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
  
    // If we are in development, we return the localhost URL
    return "http://10.103.112.186:8081";
  };