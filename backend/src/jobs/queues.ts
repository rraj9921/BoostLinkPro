import { Queue } from "bullmq";
import IORedis from "ioredis";

// Parse Redis URL or use default with optional password
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisPassword = process.env.REDIS_PASSWORD;

export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
  password: redisPassword,
  lazyConnect: true, // Don't fail immediately if Redis is unavailable
});

// Handle connection errors gracefully
redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

redis.on("ready", () => {
  console.log("Redis connected successfully");
});

export const dmQueue = new Queue("dm-queue", { connection: redis });
export const emailQueue = new Queue("email-queue", { connection: redis });

console.log("BullMQ queues initialized");
