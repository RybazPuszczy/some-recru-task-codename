import { Express } from "express";
import { EventSchema } from "../models/events.model";
import { getPreferences } from "../services/preferences.service";
import { getZodError, isTimeBetween } from "../utils/utils";
import z from "zod";

export const eventsControllerFactory = (app: Express) => {
  app.post("/events", (req, res) => {
    console.log("Received event:", req.body);

    try {
      // validated provided event format
      const event = EventSchema.parse(req.body);
      // Look up the userId to get their preferences.
      const userPreferences = getPreferences(event.userId);

      // Check if the user has disabled notifications for the event's eventType
      if (!userPreferences.eventSettings[event.eventType].enabled) {
        res.status(200).send({
          decision: "DO_NOT_NOTIFY",
          reason: "USER_UNSUBSCRIBED_FROM_EVENT",
        });
      } else if (
        // Check if the event's timestamp falls within the user's "Do Not Disturb" (DND) window.
        isTimeBetween(
          event.timestamp,
          userPreferences.dnd.start,
          userPreferences.dnd.end,
        )
      ) {
        res.status(200).send({
          decision: "DO_NOT_NOTIFY",
          reason: "DND_ACTIVE",
        });
      } else {
        res.status(202).send({ decision: "PROCESS_NOTIFICATION" });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const error = getZodError(err);
        res.status(400).send({ error: error });
      } else {
        res.status(500).send({ message: err });
      }
    }
  });
};
