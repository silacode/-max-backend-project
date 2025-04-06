import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, and } from "drizzle-orm";
import type { Env } from "../../worker-configuration";
import type { ReleaseStatus, Variables } from "../types";
import { schema, lower } from "../db";
import { releaseSchema } from "../schemas/validation";
import { NotFoundError } from "../errors/custom-errors";
import { successResponse } from "../utils/responses";

/**
 * Router handling all release-related endpoints.
 * Provides functionality for creating and retrieving music releases.
 */
const releases = new Hono<{ Bindings: Env; Variables: Variables }>();

/**
 * Retrieves a list of releases with optional filtering.
 * @route GET /
 * @param {Object} query - Query parameters
 * @param {string} [query.artist_id] - Filter releases by artist ID
 * @param {string} [query.genre] - Filter releases by genre
 * @param {ReleaseStatus} [query.status] - Filter releases by status
 * @returns {Promise<Response>} JSON response containing an array of releases
 */
releases.get("/", async (c) => {
  const artist_id = c.req.query("artist_id");
  const { genre, status } = c.req.query();

  const db = c.get("db");
  const query = db
    .select({
      id: schema.releases.id,
      title: schema.releases.title,
      status: schema.releases.status,
      artist_id: schema.releases.artist_id,
    })
    .from(schema.releases)
    .$dynamic();

  const conditions = [];

  if (artist_id) conditions.push(eq(schema.releases.artist_id, artist_id));
  if (genre)
    conditions.push(eq(lower(schema.releases.genre), genre.toLowerCase()));
  if (status)
    conditions.push(eq(lower(schema.releases.status), status.toLowerCase()));

  const results = await query.where(and(...conditions)).all();
  return successResponse(c, { results });
});

/**
 * Creates a new release.
 * @route POST /
 * @param {Object} requestBody - The release data
 * @param {string} requestBody.title - The title of the release
 * @param {string} requestBody.releaseDate - The release date
 * @param {ReleaseStatus} requestBody.status - The status of the release
 * @param {string} requestBody.genre - The genre of the release
 * @param {string} requestBody.artistId - The ID of the artist
 * @returns {Promise<Response>} JSON response containing the created release
 * @throws {NotFoundError} If the specified artist doesn't exist
 */
releases.post("/", zValidator("json", releaseSchema), async (c) => {
  const data = c.req.valid("json");
  const { title, release_date, status, genre, artist_id } = data;

  const db = c.get("db");

  // Verify that the artist exists
  const artist = await db
    .select()
    .from(schema.artists)
    .where(eq(schema.artists.id, artist_id))
    .get();

  if (!artist) {
    throw new NotFoundError("Artist not found");
  }

  const result = await db
    .insert(schema.releases)
    .values({
      title,
      release_date,
      status,
      genre,
      artist_id,
    })
    .returning();

  return successResponse(c, result, "Release created", 201);
});

export default releases;
