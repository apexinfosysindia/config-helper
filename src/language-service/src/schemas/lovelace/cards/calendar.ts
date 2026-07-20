/**
 * Lovelace Calendar Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-calendar-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import { Entity } from "../../types";
import { ViewLayout } from "../types";

export interface Schema {
  /**
   * The Calendar card displays your calendar entities in a month, day and list view.
   * https://docs.apexinfosys.in/lovelace/calendar/
   */
  type: "calendar";

  /**
   * A list of calendar entities that will be displayed in the card.
   * https://docs.apexinfosys.in/lovelace/calendar/#entities
   */
  entities?: Entity[];

  /**
   * The view that will show first when the card is loaded onto the page.
   * https://docs.apexinfosys.in/lovelace/calendar/#initial_view
   */
  initial_view?: "dayGridMonth" | "dayGridWeek" | "dayGridDay" | "listWeek";

  /**
   * The card theme, which may be set to any theme from the themes.yaml file.
   * https://docs.apexinfosys.in/lovelace/calendar/#theme
   */
  theme?: string;

  /**
   * The title of the card.
   * https://docs.apexinfosys.in/lovelace/calendar/#title
   */
  title?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
