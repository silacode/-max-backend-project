import * as t from "drizzle-orm/sqlite-core";
import { AnySQLiteColumn, sqliteTable as table } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ReleaseStatus } from "../types";

// Helper for timestamps
const timestamps = {
  created_at: t
    .integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: t
    .integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
};

export const artists = table("artists", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), //UUID (globally unique) for distributed database like cloudflare D1, handled by the application
  name: t.text("name").notNull(),
  bio: t.text("bio").notNull(),
  genre: t.text("genre").notNull(),
  ...timestamps,
});

export const releases = table("releases", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), //UUID (globally unique) for distributed database like cloudflare D1, handled by the application
  title: t.text("title").notNull(),
  release_date: t.integer("release_date", { mode: "timestamp" }).notNull(),
  status: t // this add validation during compile time. During runtime validation doesn't work. Also not implemented in database
    .text("status", {
      enum: [
        ReleaseStatus.UNRELEASED,
        ReleaseStatus.RELEASED,
        ReleaseStatus.TRENDING,
      ],
    })
    .notNull(),
  genre: t.text("genre").notNull(),
  artist_id: t
    .text("artist_id")
    .notNull()
    .references(() => artists.id),
  ...timestamps,
});

// Helper for case-insensitive text comparison
export const lower = (column: AnySQLiteColumn): SQL => sql`lower(${column})`;
