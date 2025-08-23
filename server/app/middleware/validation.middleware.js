import { StatusCodes } from "http-status-codes";

import { formatError } from "../../utils/handlers/errorHandler.js";

// Function to transform Joi's ValidationErrorItem[] into a standardized format
const transformJoiErrors = details => {
  return details.map(detail => ({
    message: detail.message,
    path: detail.path,
    type: detail.type,
    label: detail.context?.label || "unknown", // Ensure label is defined
    context: { label: detail.context?.label || "unknown" }, // Ensure context is defined
  }));
};

const validationMiddleware =
  ({ bodySchema, paramsSchema }) =>
  (req, res, next) => {
    let errors = [];

    try {
      // Validate request body if a bodySchema is provided
      if (bodySchema) {
        const { error } = bodySchema.validate(req.body, { abortEarly: false });
        if (error) {
          errors = errors.concat(
            formatError(transformJoiErrors(error.details)).map(
              err => err.message,
            ),
          );
        }
      }

      // Validate request params if a paramsSchema is provided
      if (paramsSchema) {
        const { error } = paramsSchema.validate(req.params, {
          abortEarly: false,
        });
        if (error) {
          errors = errors.concat(
            formatError(transformJoiErrors(error.details)).map(
              err => err.message,
            ),
          );
        }
      }

      // If there are validation errors, send a 400 response
      if (errors.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Validation Error",
          errors,
        });
        return;
      }

      next();
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred while processing validation.",
        errors: [
          err instanceof Error ? err.message : "Unknown validation error",
        ],
      });
    }
  };

export default validationMiddleware;
