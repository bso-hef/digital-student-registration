import jwt from "jsonwebtoken";
import requestIp from "request-ip";

import LoggerService from "../app/services/Logger/index.js";
import envConstants from "../utils/constants/envConstants.js";

const { JWT_SECRET } = envConstants;
const logger = new LoggerService("Utils <<<===>>> General");

/**
 * Converts a string to a hyphenated lowercase format.
 */
export const getHyphenatedString = str => {
  return str
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

/**
 * Gets IP from user request.
 * @param req - Express Request object
 * @returns Client IP address as a string or null
 */
export const getIP = req => {
  return requestIp.getClientIp(req);
};

/**
 * Extracts the user ID from a JWT token.
 * @param token - Encrypted and encoded token
 * @returns Promise that resolves to the user ID or rejects with an error
 */
export const getUserIdFromToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        logger.error("token getUserId err", err);
        return reject(new Error("BAD_TOKEN"));
      }

      // Ensure decoded is an object and contains the `id` field
      const payload = decoded;
      if (!payload.id) {
        logger.error("Decoded token does not contain an ID.");
        return reject(new Error("BAD_TOKEN"));
      }

      resolve(payload.id);
    });
  });
};

/**
 * Gets device ID from token (alias for getUserIdFromToken).
 */
export const getDeviceIdFromToken = getUserIdFromToken;
