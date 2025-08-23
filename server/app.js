import i18n from "i18n";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";

import cookieParser from "cookie-parser";

import session from "express-session";

import bodyParser from "body-parser";

import compression from "compression";

import helmet from "helmet";

import cors from "cors";

import passport from "passport";

import mongoose from "mongoose";

import MongoStore from "connect-mongo";

import { RedisStore } from "connect-redis";

import morgan from "morgan";

import initializeMongo from "./config/mongo.js";
import initRedisClient from "./config/redis.js";
import envConstants from "./utils/constants/envConstants.js";

const { EXPRESS_ROUTER_VERSION, NODE_ENV, SESSION_SECRET } = envConstants;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Middleware: Body Parser
app.use(bodyParser.json({ limit: "200mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 100000,
  }),
);
app.use(express.json());

// Passport Configuration
import("./config/passport.js").then(passportConfig => {
  passportConfig.default(passport);
});

// Middleware: Passport
app.use(passport.initialize());

// Initialize MongoDB
initializeMongo();

// Configure Session Store
const sessionStore = new MongoStore({
  collectionName: "http-sessions-store",
  client: mongoose.connection.getClient(),
});

// Configure Redis Store
const sessionRedisStore = new RedisStore({
  client: initRedisClient,
  prefix: "http-sessions-store:",
});

app.use(
  session({
    store: NODE_ENV === "production" ? sessionRedisStore : sessionStore,
    secret: SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === "production", // Secure cookies for production
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: "lax", // Mitigate CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

// Middleware: Security, Compression, Cookies, CORS
app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));

// Configure i18n
i18n.configure({
  locales: ["en", "de"],
  directory: path.join(__dirname, "/locales"),
  objectNotation: true,
});
app.use(i18n.init);

// Routes
const routes = await import("./app/routes/index.js");
app.use(`/api/${EXPRESS_ROUTER_VERSION}`, routes.default);

// Catch-all handler for unmatched routes
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

export default app;
