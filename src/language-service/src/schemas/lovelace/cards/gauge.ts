/**
 * Lovelace Gauge Card
 * Sources:
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/hui-gauge-card.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/panels/lovelace/cards/types.ts
 *  - https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */

import { Entity } from "../../types";
import { ViewLayout } from "../types";

export interface Schema {
  /**
   * The Gauge card is a basic card that allows visually seeing sensor data.
   * https://docs.apexinfosys.in/lovelace/gauge/
   */
  type: "gauge";

  /**
   * Entity id to show.
   * https://docs.apexinfosys.in/lovelace/gauge/#entity
   */
  entity: Entity;

  /**
   * Maximum value for graph.
   * https://docs.apexinfosys.in/lovelace/gauge/#max
   */
  max?: number;

  /**
   * Minimum value for graph.
   * https://docs.apexinfosys.in/lovelace/gauge/#min
   */
  min?: number;

  /**
   * Name of Gauge Entity.
   * https://docs.apexinfosys.in/lovelace/gauge/#name
   */
  name?: string;

  /**
   * Show the gauge as a needle gauge.
   * https://docs.apexinfosys.in/lovelace/gauge/#needle
   */
  needle?: boolean;

  /**
   * List of colors and their corresponding start values. Segments will override the severity settings.
   * https://docs.apexinfosys.in/dashboards/gauge/#segments
   */
  segments?: Segment[];

  /**
   * Allows setting of colors for different numbers.
   * https://docs.apexinfosys.in/lovelace/gauge/#severity
   */
  severity?: Severity;

  /**
   * Set to any theme within themes.yaml.
   * https://docs.apexinfosys.in/lovelace/gauge/#theme
   */
  theme?: string;

  /**
   * Unit of Measurement given to data.
   * https://docs.apexinfosys.in/lovelace/gauge/#unit
   */
  unit?: string;

  /**
   * Layout options for the view this card is in
   */
  view_layout?: ViewLayout;
}

interface Severity {
  /**
   * Value from which to start green color.
   * https://docs.apexinfosys.in/lovelace/gauge/#green
   */
  green?: number;

  /**
   * Value from which to start red color.
   * https://docs.apexinfosys.in/lovelace/gauge/#red
   */
  red?: number;

  /**
   * Value from which to start yellow color.
   * https://docs.apexinfosys.in/lovelace/gauge/#yellow
   */
  yellow?: number;
}

interface Segment {
  /**
   * Value from which to start the color.
   * https://docs.apexinfosys.in/dashboards/gauge/#from
   */
  from: number;

  /**
   * Value from which to start red color.
   * https://docs.apexinfosys.in/dashboards/gauge/#red
   */
  color: string;
}
