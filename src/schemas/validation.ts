import { z } from "zod";
import { ReleaseStatus } from "../types";

export const artistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  bio: z.string().trim().min(1, "Bio is required").max(500, "Bio is too long"),
  genre: z.string().trim().min(1, "Genre is required").max(50),
});

export const releaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title is too long"),
  release_date: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date({required_error: "Date is required",
      invalid_type_error: "Invalid date format",
    })
  ),
  status: z.enum(
    [ReleaseStatus.UNRELEASED, ReleaseStatus.RELEASED, ReleaseStatus.TRENDING],
    {
      errorMap: () => ({
        message: "Status must be one of: unreleased, released, trending",
      }),
    }
  ),
  genre: z
    .string()
    .trim()
    .min(1, "Genre is required")
    .max(100, "Genre is too long"),
  artist_id: z.string().uuid({ message: "Invalid Artist ID format" }),
});
