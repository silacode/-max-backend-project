import { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Creates a standardized error response.
 * @param {Context} c - The Hono context
 * @param {string} message - The error message
 * @param {Record<string, any>} details - Additional error details
 * @param {ContentfulStatusCode} status - HTTP status code
 * @returns {Response} JSON response with error details
 */
export const errorResponse = (
  c: Context,
  message: string,
  details: Record<string, any> = {},
  status: ContentfulStatusCode
) => {
  return c.json(
    {
      success: false,
      message,
      ...details,
    },
    status
  );
};

/**
 * Creates a standardized success response.
 * @param {Context} c - The Hono context
 * @param {Record<string, any>} data - The response data
 * @param {string} message - Optional success message
 * @param {ContentfulStatusCode} status - HTTP status code
 * @returns {Response} JSON response with success data
 */
export const successResponse = (
  c: Context,
  data: Record<string, any>,
  message: string = "Success",
  status: ContentfulStatusCode = 200
) => {
  return c.json(
    {
      success: true,
      message,
      ...data,
    },
    status
  );
};
