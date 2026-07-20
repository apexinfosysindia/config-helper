/**
 * Lovelace Humidifier Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-humidifier-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import { HumidifierEntity } from "../../types";
import { ViewLayout } from "../types";

interface FeatureBase {
  type: string;
  style?: "icons" | "dropdown";
}

interface TargetHumidityFeature {
  type: "target-humidity";
}

interface HumidifierModesFeature extends FeatureBase {
  type: "humidifier-modes";
  modes?: string[];
}

interface HumidifierToggleFeature {
  type: "humidifier-toggle";
}

type Feature =
  | TargetHumidityFeature
  | HumidifierModesFeature
  | HumidifierToggleFeature;

export interface Schema {
  /**
   * The Humidifier card lets you control and monitor humidifiers, dehumidifiers, and hygrostat devices.
   * https://docs.apexinfosys.in/lovelace/humidifier/
   */
  type: "humidifier";

  /**
   * Entity id of humidifier domain.
   * https://docs.apexinfosys.in/lovelace/humidifier/#entity
   */
  entity: HumidifierEntity;

  /**
   * Name of Entity.
   * https://docs.apexinfosys.in/lovelace/humidifier/#name
   */
  name?: string;

  /**
   * Set to any theme within themes.yaml.
   * https://docs.apexinfosys.in/lovelace/humidifier/#theme
   */
  theme?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;

  /**
   * A list of features to customize the card.
   * https://docs.apexinfosys.in/dashboards/humidifier/#features
   */
  features?: Feature[];
}
