import { Hono } from "hono";
import type { Env } from "../worker-configuration";
import type { Variables } from "./types";
import { errorHandler } from "./middleware/error-handler";
import { dbMiddleware } from "./middleware/db";
import artists from "./routes/artists";
import releases from "./routes/releases";
import { errorResponse } from "./utils/responses";

/**
 * Main application entry point.
 * Sets up the Hono application with middleware, error handling, and routes.
 */
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Error handling middleware
app.onError(errorHandler);

// Database middleware - concurrency is handled by cloudflare architecture so no need for a pool or shutdown as cloudflare Worker and D1 is serverless.
app.use("*", dbMiddleware);

// 404 handler for routes that don't match
app.notFound((c) =>
  errorResponse(
    c,
    "Not Found",
    { error: `The requested endpoint '${c.req.path}' does not exist` },
    404
  )
);

/**
 * Test endpoint to verify API is running.
 * @route GET /test
 * @returns {Promise<Response>} JSON response with welcome message
 */
app.get("/", async (c) => c.json({success : true}));

// Mount routes
app.route("/artists", artists);
app.route("/releases", releases);

export default app;
