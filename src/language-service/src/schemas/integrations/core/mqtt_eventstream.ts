/**
 * MQTT Eventstream integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/mqtt_eventstream/__init__.py
 */
export type Domain = "mqtt_eventstream";
export interface Schema {
  /**
   * Topic for publishing local events.
   * https://docs.apexinfosys.in/integrations/mqtt_eventstream/#publish_topic
   */
  publish_topic?: string;

  /**
   * Topic to receive events from the remote server.
   * https://docs.apexinfosys.in/integrations/mqtt_eventstream/#subscribe_topic
   */
  subscribe_topic?: string;

  /**
   * Ignore sending these events over mqtt.
   * https://docs.apexinfosys.in/integrations/mqtt_eventstream/#ignore_event
   */
  ignore_event?: string[];
}
