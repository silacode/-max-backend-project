import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { NotFoundError, DatabaseError } from "../errors/custom-errors";
import type { Env } from "../../worker-configuration";
import type { Variables } from "../types";
import { errorResponse } from "../utils/responses";

/**
 * Global error handler middleware for the application.
 * Handles different types of errors and returns appropriate responses:
 * - HTTPException: Returns the original HTTP exception response
 * - ZodError: Returns validation errors with 400 status
 * - NotFoundError: Returns 404 with error message
 * - DatabaseError: Returns 500 with database error details
 * - Other errors: Returns 500 with generic error message
 *
 * @param {Error} err - The error that was thrown
 * @param {Context} c - The Hono context
 * @returns {Promise<Response>} Formatted error response
 */
export const errorHandler = async (
  err: Error,
  c: Context<{ Bindings: Env; Variables: Variables }>
) => {
  console.error(`Error: ${err.message}`);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if (err instanceof z.ZodError) {
    const errors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return errorResponse(c, "Validation error", { errors }, 400);
  }

  if (err instanceof NotFoundError) {
    return errorResponse(c, err.message, {}, 404);
  }

  if (err instanceof DatabaseError) {
    return errorResponse(
      c,
      "Database operation failed",
      { error: err.message },
      500
    );
  }

  return errorResponse(
    c,
    "An unexpected error occurred",
    { error: err instanceof Error ? err.message : String(err) },
    500
  );
};
