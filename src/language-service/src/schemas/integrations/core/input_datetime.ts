/**
 * Input Datetime integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/input_datetime/__init__.py
 */
import { IncludeNamed } from "../../types";

export type Domain = "input_datetime";
export interface Schema {
  [key: string]: Item | IncludeNamed | null;
}
export type File = Schema | Item;

interface Item {
  /**
   * Set to true if the input should have a date. At least one of has_time or has_date must be defined.
   * https://docs.apexinfosys.in/integrations/input_datetime/#has_date
   */
  has_date?: boolean;

  /**
   * Set to true if the input should have a time. At least one of has_time or has_date must be defined.
   * https://docs.apexinfosys.in/integrations/input_datetime/#has_time
   */
  has_time?: boolean;

  /**
   * The icon that shows in the frontend.
   * https://docs.apexinfosys.in/integrations/input_boolean#icon
   */
  icon?: string;

  /**
   * Initial value when ApexOS starts.
   * https://docs.apexinfosys.in/integrations/input_datetime/#initial
   */
  initial?: string;

  /**
   * Name of the input datetime.
   * https://docs.apexinfosys.in/integrations/input_datetime/#name
   */
  name?: string;
}
