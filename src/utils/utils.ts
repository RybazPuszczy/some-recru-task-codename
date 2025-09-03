import { EventTimestamp } from "../models/events.model";
import { PreferencesTime } from "../models/preferences.model";
import z from "zod";

/**
 * Checks if the current time falls within a specified time range, precise to the minute.
 * @param {EventTimestamp} timestamp - The time to check (e.g. 2020-01-01T06:15:00Z). ATTENTION! It is adjusted accordingly to your environment TZ (or system TZ by default).
 * @param {PreferencesTime} start - The start hour (HH:MM).
 * @param {PreferencesTime} end - The end hour (HH:MM).
 * @returns {boolean} True if the current time is within the range (inclusive of the start, exclusive of the end), false otherwise.
 */
export function isTimeBetween(
  timestamp: EventTimestamp,
  start: PreferencesTime,
  end: PreferencesTime,
) {
  // assumes HH:MM time format as of moment of writing it along with the same format PreferencesTime zod type
  // gets hours and hours from start/end parameters
  const startH: number = parseInt(start.split(":")[0]);
  const startM: number = parseInt(start.split(":")[1]);
  const endH: number = parseInt(end.split(":")[0]);
  const endM: number = parseInt(end.split(":")[1]);

  // prepares values for comparison (brings everything to minutes count since the 00:00)
  const timestampTime = new Date(timestamp);
  // "checkTime" is time to be checked if falls between start and end times.
  const checkTime = timestampTime.getHours() * 60 + timestampTime.getMinutes();
  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;

  // if range crosses the midnight
  if (endTime < startTime) return checkTime >= startTime || checkTime < endTime;
  // if range does not cross the midnight
  return checkTime >= startTime && checkTime < endTime;
}
/**
 * Checks if the current time falls within a specified time range, precise to the minute.
 * @param {ZodError} err - an instance of ZodError.
 * @returns {object} processed content of ZodError
 */
export function getZodError(err: z.ZodError): object {
  return { issues: err.issues };
}
