import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import express from "express";

import envConstants from "../../utils/constants/envConstants.js";
import { getRouteNameFromFile } from "../../utils/handlers/fileHandler.js";
import Logger from "../services/Logger/index.js";

const { EXPRESS_ROUTER_VERSION } = envConstants;

const logger = new Logger("Router");

const router = express.Router();
const currentVersion = EXPRESS_ROUTER_VERSION || "v1";

// Fix `__dirname` for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.join(__dirname, currentVersion);

// router.use(
//   `/api/${currentVersion}/user`,
//   (await import(`./${currentVersion}/user.route.js`)).default,
// );

// Health check route
router.get("/health", (req, res) => {
  res.status(200).send({ status: "ok", message: "Server is running" });
});

// Dynamically load routes from the versioned folder
const loadRoutes = async () => {
  const files = fs.readdirSync(routesPath);
  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const routeName = getRouteNameFromFile(file); // used for the URL path segment

    if (routeName === "index" || routeName === "auth") continue;

    try {
      const routePath = pathToFileURL(path.join(routesPath, file)).href;
      const routeModule = await import(routePath);
      const route = routeModule.default;

      if (typeof route === "function" || route instanceof express.Router) {
        router.use(`/api/${currentVersion}/${routeName}`, route);
      } else {
        logger.error(
          `Route ${routeName} is not a valid middleware function or router.`,
        );
      }
    } catch (error) {
      logger.error(
        `Failed to load route ${file}: ${error.message}\n${error.stack}`,
      );
    }
  }
};

// Call the function to load routes dynamically
await loadRoutes();

/*
 * Handle 404 error
 */
router.use("/{*any}", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    errors: {
      msg: "URL_NOT_FOUND",
    },
  });
});

export default router;
