import { Express } from "express";
import z from "zod";

import { PreferencesSchema } from "../models/preferences.model";
import { UserIdSchema } from "../models/users.model";
import {
  getPreferences,
  setPreferences,
} from "../services/preferences.service";
import { getZodError } from "../utils/utils";

export const preferencesControllerFactory = (app: Express) => {
  app.get("/preferences/:userId", (req, res) => {
    console.log(`Preferences for user ${req.params.userId} requested`);

    try {
      // get user Preferences by provided userId.
      // for non-existent user it's gonna return an empty object.
      // for wrong user id format notify about that by throwing a zod error.
      const userId = UserIdSchema.parse(req.params.userId);
      const preferences = getPreferences(userId);
      res.status(200).send({ preferences: preferences });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const error = { issues: err.issues };
        res.status(400).send({ error: error });
      } else {
        res.status(500).send({ error: err });
      }
    }
  });

  app.post("/preferences/:userId", (req, res) => {
    console.log(
      `Updating preferences for user ${req.params.userId}...`,
      req.body,
    );

    try {
      // parsing both user id and preferences object is mandatory here as to provide model-perfect entry in data source.
      const userId = UserIdSchema.parse(req.params.userId);
      const newPreferences = PreferencesSchema.parse(req?.body);
      // call to service for saving a validated entry
      setPreferences(userId, newPreferences);

      res
        .status(200)
        .send({ message: `Preferences for user ${req.params.userId} updated` });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const error = getZodError(err);
        res.status(400).send({ error: error });
      } else {
        res.status(500).send({ error: err });
      }
    }
  });
};
