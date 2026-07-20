/**
 * Lovelace Area Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-area-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 */

export interface Schema {
  /**
   * The Area card lets you control and monitor an individual area.
   * https://docs.apexinfosys.in/lovelace/area/
   */
  type: "area";

  /**
   * The ID of the area to show.
   * https://docs.apexinfosys.in/lovelace/area/#area
   */
  area: string;

  /**
   * Link to Lovelace view.
   * https://docs.apexinfosys.in/lovelace/area/#navigation_path
   */
  navigation_path?: string;

  /**
   * Changes the area picture to a live feed of the camera set for the area.
   * https://docs.apexinfosys.in/lovelace/area/#show_camera
   */
  show_camera?: boolean;

  /**
   * Override the used theme for this card with any loaded theme.
   * https://docs.apexinfosys.in/lovelace/area/#theme
   */
  theme?: string;
}
