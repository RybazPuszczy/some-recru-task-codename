import {
  Preferences,
  PreferencesRepository,
} from "src/models/preferences.model";

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

// getter
export const getPreferences = (
  userId: keyof PreferencesRepository,
): Preferences => { 
  return preferencesRepository[userId];
};

// setter
export const setPreferences = (
  userId: keyof PreferencesRepository,
  newPreferences: Preferences,
) => {
  preferencesRepository[userId] = newPreferences;
};
