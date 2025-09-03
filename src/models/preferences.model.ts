import { z } from "zod";

import { UserId } from "./users.model";
import { EventType, EventTypeSchema } from "./events.model";

export const PreferencesTimeSchema = z.iso.time({ precision: -1 });
export type PreferencesTime = z.infer<typeof PreferencesTimeSchema>;

export const PreferencesSchema = z.object({
  dnd: z.object({
    start: PreferencesTimeSchema,
    end: PreferencesTimeSchema,
  }),
  eventSettings: z.record(
    EventTypeSchema,
    z.object({
      enabled: z.boolean(),
    }),
  ),
});

export type Preferences = z.infer<typeof PreferencesSchema>;

export interface PreferencesRepository {
  [userId: UserId]: Preferences;
}
