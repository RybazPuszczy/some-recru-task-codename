import { z } from "zod";

import { UserId } from "./users.model";

export const PreferencesSchema = z.object({
  dnd: z.object({
    start: z.iso.time({ precision: -1 }),
    end: z.iso.time({ precision: -1 }),
  }),
  eventSettings: z.object({
    item_shipped: z.object({
      enabled: z.boolean(),
    }),
    invoice_generated: z.object({
      enabled: z.boolean(),
    }),
  }),
});

export type Preferences = z.infer<typeof PreferencesSchema>;

export interface PreferencesRepository {
  [userId: UserId]: Preferences;
}
