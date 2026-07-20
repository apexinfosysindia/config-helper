/**
 * Input Button integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/input_button/__init__.py
 */
import { IncludeNamed } from "../../types";

export type Domain = "input_button";
export interface Schema {
  [key: string]: Item | IncludeNamed | null;
}
export type File = Schema | Item;

interface Item {
  /**
   * The icon that shows in the frontend.
   * https://docs.apexinfosys.in/integrations/input_button#icon
   */
  icon?: string;

  /**
   * Name of the input button.
   * https://docs.apexinfosys.in/integrations/input_button#name
   */
  name?: string;
}
