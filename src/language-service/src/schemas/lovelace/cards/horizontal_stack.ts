/**
 * Lovelace Horizontal Stack Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-horizontal-stack-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */

import { Card, ViewLayout } from "../types";

export interface Schema {
  /**
   * The Horizontal Stack card allows you to stack together multiple cards, so they always sit next to each other in the space of one column
   * https://docs.apexinfosys.in/lovelace/horizontal-stack/
   */
  type: "horizontal-stack";

  /**
   * List of cards.
   * https://docs.apexinfosys.in/lovelace/horizontal-stack/#cards
   */
  cards: Card[];

  /**
   * Title of Stack.
   * https://docs.apexinfosys.in/lovelace/horizontal-stack/#title
   */
  title?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
