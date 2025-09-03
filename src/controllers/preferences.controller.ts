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
      const preferences = getPreferences(req.params.userId);
      res.status(200).send({ preferences: preferences });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  });

  app.post("/preferences/:userId", (req, res) => {
    console.log(
      `Updating preferences for user ${req.params.userId}...`,
      req.body,
    );

    try {
      const userId = UserIdSchema.parse(req.params.userId);
      const newPreferences = PreferencesSchema.parse(req?.body);

      setPreferences(userId, newPreferences);

      res
        .status(200)
        .send({ message: `Preferences for user ${req.params.userId} updated` });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const error = getZodError(err);
        res.status(400).send({ error: error });
      }
    }
  });
};
