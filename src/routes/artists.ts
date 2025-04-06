import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import type { Env } from "../../worker-configuration";
import type { Variables } from "../types";
import { schema, lower } from "../db";
import { artistSchema } from "../schemas/validation";
import { NotFoundError } from "../errors/custom-errors";
import { successResponse } from "../utils/responses";

/**
 * Router handling all artist-related endpoints.
 * Provides functionality for creating and retrieving artist information.
 */
const artists = new Hono<{ Bindings: Env; Variables: Variables }>();

/**
 * Retrieves a list of artists with optional filtering.
 * @route GET /
 * @param {Object} query - Query parameters
 * @param {string} [query.genre] - Filter artists by genre
 * @param {string} [query.name] - Filter artists by name
 * @returns {Promise<Response>} JSON response containing an array of artists
 */
artists.get("/", async (c) => {
  const { genre, name } = c.req.query();
  const db = c.get("db");
  const query = db
    .select({
      id: schema.artists.id,
      name: schema.artists.name,
      genre: schema.artists.genre,
    })
    .from(schema.artists)
    .$dynamic();

  const conditions = [];

  if (genre)
    conditions.push(eq(lower(schema.artists.genre), genre.toLowerCase()));
  if (name) conditions.push(eq(lower(schema.artists.name), name.toLowerCase()));

  const results = await query.where(and(...conditions)).all();
  return successResponse(c, { results });
});

/**
 * Creates a new artist.
 * @route POST /
 * @param {Object} requestBody - The artist data
 * @param {string} requestBody.name - The name of the artist
 * @param {string} requestBody.bio - The artist's biography
 * @param {string} requestBody.genre - The primary genre of the artist
 * @returns {Promise<Response>} JSON response containing the created artist
 */
artists.post("/", zValidator("json", artistSchema), async (c) => {
  const data = c.req.valid("json");
  const { name, bio, genre } = data;

  const db = c.get("db");
  const result = await db
    .insert(schema.artists)
    .values({
      name,
      bio,
      genre,
    })
    .returning();

  return successResponse(c, { result }, "Artist created", 201);
});

/**
 * Retrieves a specific artist by ID.
 * @route GET /:id
 * @param {string} id - The ID of the artist to retrieve
 * @returns {Promise<Response>} JSON response containing the artist details
 * @throws {NotFoundError} If the artist with the specified ID doesn't exist
 */
artists.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");
  const result = await db
    .select()
    .from(schema.artists)
    .where(eq(schema.artists.id, id))
    .get();

  if (!result) {
    throw new NotFoundError(`Artist with ID '${id}' not found`);
  }

  return successResponse(c, { result });
});

export default artists;
