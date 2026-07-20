/**
 * Lovelace Grid Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-grid-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */

import { PositiveInteger } from "../../types";
import { Card, ViewLayout } from "../types";

export interface Schema {
  /**
   * The Grid card allows you to show multiple cards in a grid. It will first fill the columns, automatically adding new rows as needed.
   * https://docs.apexinfosys.in/lovelace/grid/
   */
  type: "grid";

  // : Reference to card type
  /**
   * List of cards.
   * https://docs.apexinfosys.in/lovelace/grid/#cards
   */
  cards: Card[];

  /**
   * Number of columns in the grid.
   * https://docs.apexinfosys.in/lovelace/grid/#columns
   */
  columns?: PositiveInteger;

  /**
   * Should the cards be shown square.
   * https://docs.apexinfosys.in/lovelace/grid/#square
   */
  square?: boolean;

  /**
   * Title of Grid.
   * https://docs.apexinfosys.in/lovelace/grid/#title
   */
  title?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
