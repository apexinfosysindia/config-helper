import { Entities, Domains } from "../../types";

/**
 * MQTT Statestream integration
 * Source: https://github.com/apexos/core/tree/dev/apexos/components/mqtt_statestream
 */
export type Domain = "mqtt_statestream";
export interface Schema {
  /**
   * Base topic used to generate the actual topic used to publish.
   * https://docs.apexinfosys.in/integrations/mqtt_statestream/#base_topic
   */
  base_topic: string;

  /**
   * Publish attributes of the entity as well as the state.
   * https://docs.apexinfosys.in/integrations/mqtt_statestream/#publish_attributes
   */
  publish_attributes?: boolean;

  /**
   * Publish the last_changed and last_updated timestamps for the entity.
   * https://docs.apexinfosys.in/integrations/mqtt_statestream/#publish_timestamps
   */
  publish_timestamps?: boolean;

  /**
   * Configure which integrations should be excluded from the statestream
   * https://docs.apexinfosys.in/integrations/mqtt_statestream/#exclude
   */
  exclude?: {
    /**
     * The list of entity ids to be excluded from the statestream.
     * https://docs.apexinfosys.in/integrations/mqtt_statestream/#entities
     */
    entities?: Entities;

    /**
     * Exclude all entities matching a listed pattern from the statestream (e.g., sensor.weather_*).
     * https://docs.apexinfosys.in/integrations/mqtt_statestream/#entity_globs
     */
    entity_globs?: string[];

    /**
     * The list of domains to be excluded from the statestream.
     * https://docs.apexinfosys.in/integrations/mqtt_statestream/#domains
     */
    domains?: Domains;
  }[];

  /**
   * Configure which integrations should be included in the statestream. If set, all other entities will not be included.
   * https://docs.apexinfosys.in/integrations/mqtt_statestream/#include
   */
  include?: {
    /**
     * The list of entity ids to be included in the statestream.
     * https://docs.apexinfosys.in/integrations/mqtt_statestream/#entities
     */
    entities?: Entities;

    /**
     * Include all entities matching a listed pattern from the statestream (e.g., sensor.weather_*).
     * https://docs.apexinfosys.in/integrations/mqtt_statestream/#entity_globs
     */
    entity_globs?: string[];

    /**
     * The list of domains to be excluded from the statestream.
     * https://docs.apexinfosys.in/integrations/mqtt_statestream/#domains
     */
    domains?: Domains;
  };
}
