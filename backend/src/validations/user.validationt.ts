import { z } from "zod";

export const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email("Invalid email address"),
});
