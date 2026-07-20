/**
 * Times of the Day integration
 * Source: https://github.com/apexos/core/tree/dev/apexos/components/tod/
 */
import { Time, TimePeriod } from "../../types";
import { PlatformSchema } from "../platform";

export type Domain = "tod";

export interface BinarySensorPlatformSchema extends PlatformSchema {
  /**
   * The tod platform supports binary sensors which get their values by checking if the current time is within defined time ranges.
   * https://docs.apexinfosys.in/integrations/tod
   */
  platform: "tod";

  /**
   * Name of the sensor
   * https://docs.apexinfosys.in/integrations/tod/#name
   */
  name: string;

  /**
   * The absolute local time value or sun event for beginning of the time range.
   * https://docs.apexinfosys.in/integrations/tod/#before
   */
  before: "sunset" | "sunrise" | Time;

  /**
   * The time offset of the beginning time range.
   * https://docs.apexinfosys.in/integrations/tod/#before_offset
   */
  before_offset?: TimePeriod;

  /**
   * The absolute local time value or sun event for ending of the time range.
   * https://docs.apexinfosys.in/integrations/tod/#after
   */
  after: "sunset" | "sunrise" | Time;

  /**
   * The time offset of the ending time range.
   * https://docs.apexinfosys.in/integrations/tod/#after_offset
   */
  after_offset?: TimePeriod;

  /**
   * The unique ID for this config block. This will be prefixed to all unique IDs of all entities in this block.
   * https://docs.apexinfosys.in/integrations/tod/#unique_id
   */
  unique_id?: string;
}
