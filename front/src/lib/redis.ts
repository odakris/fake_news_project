import Redis from "ioredis";
import { env } from "./env";

const redisClientSingleton = () => {
  return new Redis(env.REDIS_URL);
};

type RedisClientSingleton = ReturnType<typeof redisClientSingleton>;

const globalForRedis = globalThis as unknown as {
  redis: RedisClientSingleton | undefined;
};

export const redis = globalForRedis.redis ?? redisClientSingleton();

if (env.NODE_ENV !== "production") globalForRedis.redis = redis;
