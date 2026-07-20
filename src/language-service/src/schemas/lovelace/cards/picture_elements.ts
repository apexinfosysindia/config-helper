/**
 * Lovelace Picture Entity Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-elements-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import { CameraEntity } from "../../types";
import { Element } from "../elements";
import { ViewLayout } from "../types";

export interface Schema {
  /**
   * The cards allow you to position icons or text and even services on an image based on coordinates. Imagine floor plan, imagine picture-glance with no restrictions!
   * https://docs.apexinfosys.in/lovelace/picture-elements/
   */
  type: "picture-elements";

  /**
   * A camera entity.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#camer_image
   */
  camera_image?: CameraEntity;

  /**
   * “live” will show the live view if stream is enabled.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#camera_view
   */
  camera_view?: "live" | "auto";

  /**
   * This CSS filter is used when the dark mode is activated.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#dark_mode_filter
   */
  dark_mode_filter?: string;

  /**
   * This image is used when the dark mode is activated and no state image is set.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#dark_mode_image
   */
  dark_mode_image?: string;

  /**
   * List of elements.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#elements
   */
  elements: Element[];

  /**
   * The URL of an image.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#image
   */
  image: string;

  /**
   * State-based CSS filters.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#state_filter
   */
  state_filter?: { [key: string]: string };

  /**
   * Set to any theme within themes.yaml.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#theme
   */
  theme?: string;

  /**
   * Card title.
   * https://docs.apexinfosys.in/lovelace/picture-elements/#title
   */
  title?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}
