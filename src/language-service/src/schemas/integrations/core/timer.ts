/**
 * Timer integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/timer/__init__.py
 */
import { IncludeNamed } from "../../types";

export type Domain = "timer";

export interface Schema {
  [key: string]: Item | IncludeNamed;
}

interface Item {
  /**
   * Friendly name of the timer.
   * https://docs.apexinfosys.in/integrations/timer/#name
   */
  name?: string;

  /**
   * Initial duration in seconds or `00:00:00` when ApexOS starts.
   * https://docs.apexinfosys.in/integrations/timer/#duration
   */
  duration?: string | number;

  /**
   * Set a custom icon for the state card.
   * https://docs.apexinfosys.in/integrations/timer/#icon
   */
  icon?: string;

  /**
   * When true, active and paused timers will be restored to the correct state and
   * time on ApexOS startup and restarts.
   * https://docs.apexinfosys.in/integrations/timer/#restore
   */
  restore?: boolean;
}
