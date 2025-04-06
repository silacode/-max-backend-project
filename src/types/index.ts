import { DrizzleD1Database } from "drizzle-orm/d1";
import { schema } from "../db";

export type Variables = {
  db: DrizzleD1Database<typeof schema>;
};

export const ReleaseStatus = {
  UNRELEASED: "unreleased",
  RELEASED: "released",
  TRENDING: "trending",
} as const;

export type ReleaseStatus = (typeof ReleaseStatus)[keyof typeof ReleaseStatus];
