import {
  Preferences,
  PreferencesRepository,
} from "src/models/preferences.model";
import { UserId } from "src/models/users.model";

// fake preferences repository
const preferencesRepository: PreferencesRepository = {
  usr_abcde: {
    dnd: {
      start: "22:00",
      end: "07:00",
    },
    eventSettings: {
      item_shipped: {
        enabled: true,
      },
      invoice_generated: {
        enabled: true,
      },
    },
  },
  usr_efghi: {
    dnd: {
      start: "21:00",
      end: "04:00",
    },
    eventSettings: {
      item_shipped: {
        enabled: true,
      },
      invoice_generated: {
        enabled: true,
      },
    },
  },
};

/**
 * Retrieves user preferences from the repository.
 * @param {string} userId - The unique identifier of the user whose preferences are being get.
 * @returns {Preferences} - Preferences object
 */
export const getPreferences = (
  userId: keyof PreferencesRepository,
): Preferences => {
  return preferencesRepository[userId];
};

/**
 * Sets or updates a user's preferences in the repository.
 * @param {string} userId - The unique identifier of the user whose preferences are being set.
 * @param {Preferences} preferences - The complete preferences object.
 * @returns {void}
 */
export const setPreferences = (
  userId: keyof PreferencesRepository,
  preferences: Preferences,
) => {
  preferencesRepository[userId] = preferences;
};
