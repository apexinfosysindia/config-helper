/**
 * Counter integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/counter/__init__.py
 */
import { Integer, IncludeNamed, PositiveInteger } from "../../types";

export type Domain = "counter";
export interface Schema {
  [key: string]: Item | IncludeNamed;
}

interface Item {
  /**
   * The icon that shows in the frontend.
   * https://docs.apexinfosys.in/integrations/counter/#icon
   */
  icon?: string;

  /**
   * Initial value when ApexOS starts or the counter is reset.
   * https://docs.apexinfosys.in/integrations/counter/#initial
   */
  initial?: PositiveInteger;

  /**
   * Maximum value the counter will have.
   * https://docs.apexinfosys.in/integrations/counter/#maximum
   */
  maximum?: Integer;

  /**
   * Minimum value the counter will have.
   * https://docs.apexinfosys.in/integrations/counter/#minimum
   */
  minimum?: Integer;

  /**
   * Name of the counter.
   * https://docs.apexinfosys.in/integrations/counter/#name
   */
  name?: string;

  /**
   * Try to restore the last known value when ApexOS starts, defaults to `true`.
   * https://docs.apexinfosys.in/integrations/counter/#restore
   */
  restore?: boolean;

  /**
   * Incremental/step value for the counter.
   * https://docs.apexinfosys.in/integrations/counter/#step
   */
  step?: PositiveInteger;
}
