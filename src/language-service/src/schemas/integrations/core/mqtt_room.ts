/**
 * MQTT Room Presence
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/mqtt_room/
 */
import { PositiveInteger } from "../../types";
import { PlatformSchema } from "../platform";

export type Domain = "mqtt_room";

export interface SensorPlatformSchema extends PlatformSchema {
  /**
   * The mqtt_room sensor platform allows you to detect the indoor location of devices using MQTT clients.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt
   */
  platform: "mqtt_room";

  /**
   * The device id to track for this sensor.
   * https://docs.apexinfosys.in/integrations/mqtt_room/#device_id
   */
  device_id: string;

  /**
   * The name of the MQTT sensor.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#name
   */
  name?: string;

  /**
   * The MQTT topic subscribed to receive sensor values.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#state_topic
   */
  state_topic: string;

  /**
   * The time in seconds after which a room presence state is considered old.
   * https://docs.apexinfosys.in/integrations/mqtt_room/#timeout
   */
  timeout?: PositiveInteger;

  /**
   * The time in seconds after which the state should be set to not_home if there were no updates. 0 disables the check.
   * https://docs.apexinfosys.in/integrations/mqtt_room/#away_timeout
   */
  away_timeout?: PositiveInteger;

  /**
   * An ID that uniquely identifies this room sensor. If two sensors have the same unique ID, ApexOS will raise an exception.
   * https://docs.apexinfosys.in/integrations/mqtt_room/#unique_id
   */
  unique_id?: string;
}
