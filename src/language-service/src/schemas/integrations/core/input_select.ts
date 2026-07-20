/**
 * Input Select integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/input_select/__init__.py
 */
import { IncludeNamed } from "../../types";

export type Domain = "input_number";
export interface Schema {
  [key: string]: Item | IncludeNamed | null;
}
export type File = Schema | Item;

interface Item {
  /**
   * The icon that shows in the frontend.
   * https://docs.apexinfosys.in/integrations/input_select/#icon
   */
  icon?: string;

  /**
   * Initial value when ApexOS starts.
   * https://docs.apexinfosys.in/integrations/input_select/#initial
   */
  initial?: string;

  /**
   * Name of the input select.
   * https://docs.apexinfosys.in/integrations/input_select/#name
   */
  name?: string;

  /**
   * List of options to choose from.
   * https://docs.apexinfosys.in/integrations/input_select#options
   */
  options: string[];
}
