import Logger from "@/lib/server-logger";
import mongoose from "mongoose";

const logger = new Logger("Config <<==>> MongoDB");
const uri =
  process.env.MONGODB_URI ??
  "mongodb://localhost:27017/digital-student-onboarding";

mongoose.set("strictQuery", true);

declare global {
  var __mongoCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
        state: number;
      }
    | undefined;
}

const cached =
  global.__mongoCache ??
  (global.__mongoCache = {
    conn: null,
    promise: null,
    state: mongoose.connection.readyState,
  });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function getMongoState() {
  const state = mongoose.connection.readyState;
  const map: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return { code: state, text: map[state] ?? "unknown" };
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

async function connectOnce(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => {
        logger.info("MongoDB connected successfully");
        cached.state = m.connection.readyState;
        return m;
      })
      .catch((err) => {
        logger.error("MongoDB initial connection failed:", err);
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn!;
}

export async function initializeMongo({
  attempts = 5,
}: { attempts?: number } = {}): Promise<void> {
  const conn = mongoose.connection as typeof mongoose.connection & {
    __listenersBound?: boolean;
  };
  if (!conn.__listenersBound) {
    conn.__listenersBound = true;
    conn.on("connected", () => logger.info("Event: connected"));
    conn.on("reconnected", () => logger.info("Event: reconnected"));
    conn.on("disconnected", () => logger.warn("Event: disconnected"));
    conn.on("error", (err) => logger.error("Event: error", err));
  }

  for (let retry = 0; retry < attempts; retry++) {
    try {
      await connectOnce();
      return;
    } catch (err) {
      logger.error(`MongoDB connection attempt ${retry + 1} failed:`, err);
      if (retry < attempts - 1) {
        const delay = Math.pow(2, retry) * 1000;
        logger.info(`Retrying in ${delay / 1000} seconds...`);
        await sleep(delay);
      } else {
        logger.error("Max connection attempts reached. MongoDB not connected.");
      }
    }
  }
}

export async function dbConnect(): Promise<typeof mongoose> {
  return connectOnce();
}
