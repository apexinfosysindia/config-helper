import { Entity } from "../types";
import * as cards from "./cards";

export type CardsFile = Card | Card[];

export type Card =
  | cards.AlarmPanel.Schema
  | cards.Area.Schema
  | cards.Button.Schema
  | cards.Calendar.Schema
  | cards.Conditional.Schema
  | cards.Custom.Schema
  | cards.EnergyCarbonConsumedGauge.Schema
  | cards.EnergyDateSelection.Schema
  | cards.EnergyDevicesGraph.Schema
  | cards.EnergyDistribution.Schema
  | cards.EnergyGasGraph.Schema
  | cards.EnergyGridNeutralityGauge.Schema
  | cards.EnergySolarConsumedGauge.Schema
  | cards.EnergySolarGraph.Schema
  | cards.EnergySourcesTable.Schema
  | cards.EnergyUsageGraph.Schema
  | cards.Entities.Schema
  | cards.Entity.Schema
  | cards.EntityButton.Schema
  | cards.EntityFilter.Schema
  | cards.Gauge.Schema
  | cards.Glance.Schema
  | cards.Grid.Schema
  | cards.HistoryGraph.Schema
  | cards.HorizontalStack.Schema
  | cards.Humidifier.Schema
  | cards.IFrame.Schema
  | cards.Light.Schema
  | cards.Logbook.Schema
  | cards.Map.Schema
  | cards.Markdown.Schema
  | cards.MediaControl.Schema
  | cards.Picture.Schema
  | cards.PictureElements.Schema
  | cards.PictureEntity.Schema
  | cards.PictureGlance.Schema
  | cards.PlantStatus.Schema
  | cards.Sensor.Schema
  | cards.ShoppingList.Schema
  | cards.StatisticsGraph.Schema
  | cards.Thermostat.Schema
  | cards.Tile.Schema
  | cards.VerticalStack.Schema
  | cards.WeatherForecast.Schema;

export interface EntityConfig {
  type?: string;

  /**
   * ApexOS entity ID.
   * https://docs.apexinfosys.in/lovelace/entities/#entity
   */
  entity: Entity;

  /**
   * Overwrites friendly name.
   * https://docs.apexinfosys.in/lovelace/entities/#name
   */
  name?: string;

  /**
   * Overwrites icon or entity picture.
   * https://docs.apexinfosys.in/lovelace/entities/#icon
   */
  icon?: string;

  /**
   * Overwrites entity picture.
   * https://docs.apexinfosys.in/lovelace/entities/#image
   */
  image?: string;
}

export interface Condition {
  /**
   * ApexOS entity ID.
   * https://docs.apexinfosys.in/lovelace/conditional/#entity
   */
  entity: Entity;

  /**
   * Entity state is equal to this value.
   * https://docs.apexinfosys.in/lovelace/conditional/#state
   */
  state?: string;

  /**
   * Entity state is unequal to this value.
   * https://docs.apexinfosys.in/lovelace/conditional/#state_not
   */
  state_not?: string;
}

export interface Badge {
  /**
   * Badges are widgets that sit at the top of a Lovelace panel, above all the cards.
   * https://docs.apexinfosys.in/lovelace/badges/
   */
  type?: string;
  [key: string]: any;
}

/**
 * @TJS-additionalProperties true
 */
export interface ViewLayout {
  /**
   * Defines the position of the card in an sidebar view.
   * https://docs.apexinfosys.in/lovelace/sidebar/#view_layoutposition
   */
  position?: "main" | "sidebar";
}
