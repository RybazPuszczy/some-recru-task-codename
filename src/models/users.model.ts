import z from "zod";

export const UserIdSchema = z
  .string()
  .regex(
    /^usr_[a-zA-Z0-9]{5}$/,
    "User ID must be in the format 'usr_XXXXX' (e.g., usr_abcde)",
  );
export type UserId = z.infer<typeof UserIdSchema>;

export const UserSchema = z.object({
  id: UserIdSchema,
});
export type User = z.infer<typeof UserIdSchema>;
