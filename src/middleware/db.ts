import { Context, Next } from "hono";
import type { Env } from "../../worker-configuration";
import type { Variables } from "../types";
import { createDb } from "../db";

export const dbMiddleware = async (
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) => {
  c.set("db", createDb(c.env.DB));
  await next();
};
