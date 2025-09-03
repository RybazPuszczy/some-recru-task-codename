import z from "zod";
import { UserIdSchema } from "./users.model";

export const EventIdSchema = z
  .string()
  .regex(
    /^evt_[a-zA-Z0-9]{5}$/,
    "Event ID must be in the format 'evt_XXXXX' (e.g., evt_a1b2c)",
  );
export type EventId = z.infer<typeof EventIdSchema>;

export const EventTimestampSchema = z.iso.datetime({ precision: 0 });
export type EventTimestamp = z.infer<typeof EventTimestampSchema>;

export const EventTypeSchema = z.enum(["item_shipped", "invoice_generated"]);
export type EventType = z.infer<typeof EventTypeSchema>;

export const EventSchema = z.object({
  eventId: EventIdSchema,
  userId: UserIdSchema,
  eventType: EventTypeSchema,
  timestamp: EventTimestampSchema,
});
export type Event = z.infer<typeof EventSchema>;
