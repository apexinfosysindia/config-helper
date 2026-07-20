/**
 * Lovelace Conditional Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-calendar-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import { Card, Condition, ViewLayout } from "../types";

export interface Schema {
  /**
   * The Conditional card displays another card based on entity states.
   * https://docs.apexinfosys.in/lovelace/conditional/
   */
  type: "conditional";

  /**
   * Card to display if all conditions match.
   * https://docs.apexinfosys.in/lovelace/conditional/#card
   */
  card: Card;

  /**
   * List of entity IDs and matching states.
   * https://docs.apexinfosys.in/lovelace/conditional/#conditions
   */
  conditions: Condition[];

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
