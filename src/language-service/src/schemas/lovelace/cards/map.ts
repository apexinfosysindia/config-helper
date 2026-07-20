/**
 * Lovelace Map Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-map-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import {
  Entity as EntityString,
  GeoLocationEntity as GeoLocationEntityString,
  PositiveInteger,
} from "../../types";
import { EntityConfig, ViewLayout } from "../types";

type Entity = EntityString | EntityConfig;
type GeoLocationEntity = GeoLocationEntityString | "all";

export interface Schema {
  /**
   * The Map card that allows you to display entities on a map.
   * https://docs.apexinfosys.in/lovelace/map/
   */
  type: "map";

  /**
   * List of entity IDs. Either this or the geo_location_sources configuration option is required.
   * https://docs.apexinfosys.in/lovelace/map/#entities
   */
  entities?: Entity | Entity[];

  /**
   * List of geolocation sources. All current entities with that source will be displayed on the map. See Geolocation platform for valid sources. Set to all to use all available sources. Either this or the entities configuration option is required.
   * https://docs.apexinfosys.in/lovelace/map/#geo_location_sources
   */
  geo_location_sources?: GeoLocationEntity[];

  /**
   * The card title.
   * https://docs.apexinfosys.in/lovelace/map/#title
   */
  title?: string;

  /**
   * Forces the height of the image to be a ratio of the width. You may enter a value such as: 16x9, 16:9, 1.78.
   * https://docs.apexinfosys.in/lovelace/map/#aspect_ratio
   */
  aspect_ratio?: string;

  /**
   * The default zoom level of the map.
   * https://docs.apexinfosys.in/lovelace/map/#default_zoom
   */
  default_zoom?: PositiveInteger;

  /**
   * Enable a dark theme for the map.
   * https://docs.apexinfosys.in/lovelace/map/#dark_mode
   */
  dark_mode?: boolean;

  /**
   * Shows a path of previous locations. Hours to show as path on the map.
   * https://docs.apexinfosys.in/lovelace/map/#hours_to_show
   */
  hours_to_show?: PositiveInteger;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
