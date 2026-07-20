/**
 * Lovelace Entity Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-entity-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import { Entity } from "../../types";
import { HeaderFooter } from "../headers_footers";
import { ViewLayout } from "../types";

export interface Schema {
  /**
   * The Entity card gives you a quick overview of your entity’s state.
   * https://docs.apexinfosys.in/lovelace/entity
   */
  type: "entity";

  /**
   * An attribute associated with the entity.
   * https://docs.apexinfosys.in/lovelace/entity/#attribute
   */
  attribute?: string;

  /**
   * Name of Entity
   * https://docs.apexinfosys.in/lovelace/entity/#entity
   */
  entity: Entity;

  /**
   * Footer widget to render.
   * https://docs.apexinfosys.in/lovelace/entity/#footer
   */
  footer?: HeaderFooter;

  /**
   * Overwrites icon.
   * https://docs.apexinfosys.in/lovelace/entity/#icon
   */
  icon?: string;

  /**
   * Name of Entity.
   * https://docs.apexinfosys.in/lovelace/entity/#name
   */
  name?: string;

  /**
   * Set to true to have icon colored when entity is active.
   * https://docs.apexinfosys.in/lovelace/entity/#state_color
   */
  state_color?: boolean;

  /**
   * Set to any theme within themes.yaml.
   * https://docs.apexinfosys.in/lovelace/entity/#theme
   */
  theme?: string;

  /**
   * Unit of Measurement given to the data displayed.
   * https://docs.apexinfosys.in/lovelace/entity/#unit
   */
  unit?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
