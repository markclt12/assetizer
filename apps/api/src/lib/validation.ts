import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single dashes");

/** Absolute http(s) URL, or a site-relative path such as `/illustrations/cashew.svg`. */
export const urlOrPathSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value.startsWith("/") || /^https?:\/\//i.test(value), {
    message: "Must be an http(s) URL or a path starting with /",
  });

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

/** Returns a copy without keys whose value is `undefined` (keeps explicit `null`). */
export function definedOnly<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)) as Partial<T>;
}
