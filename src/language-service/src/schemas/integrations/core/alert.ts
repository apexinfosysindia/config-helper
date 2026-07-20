/**
 * Alert integration
 * Source: https://docs.apexinfosys.in/integrations/alert/
 */
import { IncludeNamed, Template } from "../../types";

export type Domain = "alert";
export interface Schema {
  [key: string]: Item | IncludeNamed | null;
}
export type File = Schema | Item;

interface Item {
  /**
   * The friendly name of the alert.
   * https://docs.apexinfosys.in/integrations/alert/#name
   */
  name: string;

  /**
   * The ID of the entity to watch.
   * https://docs.apexinfosys.in/integrations/alert/#entity_id
   */
  entity_id: string;

  /**
   * A title to be used for the notification if the notifier supports it.
   * https://docs.apexinfosys.in/integrations/alert/#title
   */
  title?: Template;

  /**
   * The problem condition for the entity.
   * https://docs.apexinfosys.in/integrations/alert/#state
   */
  state?: string; // Default: "on"

  /**
   * Number of minutes before the notification should be repeated. Can be either a number or a list of numbers.
   * https://docs.apexinfosys.in/integrations/alert/#repeat
   */
  repeat: number | number[];

  /**
   * Control whether the notification can be acknowledged.
   * https://docs.apexinfosys.in/integrations/alert/#can_acknowledge
   */
  can_acknowledge?: boolean; // Default: true

  /**
   * Controls whether the notification should be sent immediately or after the first delay.
   * https://docs.apexinfosys.in/integrations/alert/#skip_first
   */
  skip_first?: boolean; // Default: false

  /**
   * A message to be sent after an alert transitions from `idle` to `on`.
   * https://docs.apexinfosys.in/integrations/alert/#message
   */
  message?: Template;

  /**
   * A message sent after an alert transitions from `on` or `off` to `idle`.
   * https://docs.apexinfosys.in/integrations/alert/#done_message
   */
  done_message?: Template;

  /**
   * List of notification integrations to use for alerts.
   * https://docs.apexinfosys.in/integrations/alert/#notifiers
   */
  notifiers?: string[];

  /**
   * Dictionary of extra parameters to send to the notifier.
   * https://docs.apexinfosys.in/integrations/alert/#data
   */
  data?: Record<string, any>;
}
