import { ViewLayout } from "../types";

/**
 * Lovelace Gas graph Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/energy/hui-energy-gas-graph-card.ts
 */
export interface Schema {
  /**
   * The gas consumption graph card shows the amount of gas consumed per source.
   * https://docs.apexinfosys.in/lovelace/energy/#gas-consumption-graph
   */
  type: "energy-gas-graph";

  /**
   * The card title.
   */
  title?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
