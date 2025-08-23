import _ from "lodash";

const { isEmpty } = _;

/**
 * Formats Joi error details into a user-friendly structure.
 * @param errorDetails - Array of Joi error details.
 * @returns Formatted error messages.
 */
export const formatError = errorDetails => {
  return errorDetails.map(detail => ({
    field: detail.context.label,
    message: detail.message.replace(/['"]/g, ""), // Clean up unnecessary quotes
  }));
};

/**
 * Sends a consistent error response to the client.
 * @param res - Express Response object.
 * @param statusCode - HTTP status code.
 * @param message - Error message.
 * @param errors - Array of formatted errors.
 * @param data - Additional error details.
 */
export const sendErrorResponse = (
  res,
  statusCode,
  message,
  errors = [],
  data = {},
) => {
  const responseDetails = { success: false, message };

  if (errors.length > 0) {
    responseDetails.errors = errors;
  }

  if (!isEmpty(data)) {
    responseDetails.details = data;
  }

  res.status(statusCode).json(responseDetails);
};

/**
 * Creates and throws a custom error.
 * @param statusCode - HTTP status code.
 * @param type - Error type identifier (e.g., "EMAIL_ALREADY_EXISTS").
 * @param message - Detailed error message.
 * @throws Custom error object with additional details.
 */
export const createError = (statusCode, type, message) => {
  const error = new Error(message);
  error.code = statusCode;
  error.type = type;
  throw error;
};
