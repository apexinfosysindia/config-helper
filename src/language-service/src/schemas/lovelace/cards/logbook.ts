/**
 * Lovelace Logbook Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-logbook-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import { Entity, PositiveInteger } from "../../types";
import { ViewLayout } from "../types";

export interface Schema {
  /**
   * The Logbook card displays entries from the logbook for specific entities.
   * https://docs.apexinfosys.in/lovelace/logbook/
   */
  type: "logbook";

  /**
   * The entities that will show in the card.
   * https://docs.apexinfosys.in/lovelace/logbook/#entities
   */
  entities?: Entity[];

  /**
   * Number of hours in the past to track.
   * https://docs.apexinfosys.in/lovelace/logbook/#hours_to_show
   */
  hours_to_show?: PositiveInteger;

  /**
   * Set to any theme within themes.yaml.
   * https://docs.apexinfosys.in/lovelace/logbook/#theme
   */
  theme?: string;

  /**
   * Title of the card.
   * https://docs.apexinfosys.in/lovelace/logbook/#title
   */
  title?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
