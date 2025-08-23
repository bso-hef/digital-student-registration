import { StatusCodes } from "http-status-codes";

import {
  createError,
  sendErrorResponse,
} from "../../utils/handlers/errorHandler.js";
import { ERROR_TYPES } from "../../utils/responseTypes.js";
import User from "../models/User.js";
import LoggerService from "../services/Logger/index.js";

const logger = new LoggerService("Controller <<===>> User");

/**
 * Controller: Fetch User Profile
 * Retrieves the authenticated user's profile.
 */
export const profile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw createError(
        StatusCodes.NOT_FOUND,
        ERROR_TYPES.USER_NOT_FOUND,
        ERROR_TYPES.USER_NOT_FOUND,
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User profile retrieved successfully.",
      data: { user: user.toObject() },
    });

    logger.info(`User profile fetched: ${userId}`);
  } catch (error) {
    logger.error("Error fetching user profile:", error);

    sendErrorResponse(res, error.code || 500, error.message, error.errors, {
      type: error.type || ERROR_TYPES.INTERNAL_SERVER,
    });
  }
};
