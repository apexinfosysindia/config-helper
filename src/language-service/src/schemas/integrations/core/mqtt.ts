/**
 * MQTT integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/mqtt/
 */
import {
  ColorMode,
  Deprecated,
  DeviceClassesBinarySensor,
  DeviceClassesCover,
  DeviceClassesSensor,
  IncludeList,
  Integer,
  PositiveInteger,
  StateClassesSensor,
  Template,
} from "../../types";

export type Domain = "mqtt";
type QOS = 0 | 1 | 2;
type AvailabilityMode = "all" | "any" | "latest";
interface Availability {
  /**
   * The MQTT topic subscribed to receive availability (online/offline) updates.
   */
  topic: string;

  /**
   * The payload that represents the available state.
   */
  payload_available?: string;

  /**
   * The payload that represents the unavailable state.
   */
  payload_not_available?: string;

  /**
   * Defines a template to extract the value for payload_available and payload_not_available.
   */
  value_template?: Template;
}

export type Schema = Item | Item[];

interface Item {
  /**
   * The mqtt alarm panel platform enables the possibility to control MQTT capable alarm panels. The Alarm icon will change state after receiving a new state from state_topic.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/
   */
  alarm_control_panel?:
    | AlarmControlPanelItem
    | AlarmControlPanelItem[]
    | IncludeList;

  /**
   * The mqtt binary sensor platform uses an MQTT message received to set the binary sensor’s state to on or off.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt
   */
  binary_sensor?: BinarySensorItem | BinarySensorItem[] | IncludeList;

  /**
   * The mqtt button platform lets you send an MQTT message when the button is pressed in the frontend or the button press service is called.
   * https://docs.apexinfosys.in/integrations/button.mqtt
   */
  button?: ButtonItem | ButtonItem[] | IncludeList;

  /**
   * The mqtt camera platform allows you to integrate the content of an image file sent through MQTT into ApexOS as a camera.
   * https://docs.apexinfosys.in/integrations/camera.mqtt/
   */
  camera?: CameraItem | CameraItem[] | IncludeList;

  /**
   * The mqtt climate platform lets you control your MQTT enabled HVAC devices.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/
   */
  climate?: ClimateItem | ClimateItem[] | IncludeList;

  /**
   * The mqtt cover platform allows you to control an MQTT cover (such as blinds, a rollershutter or a garage door).
   * https://docs.apexinfosys.in/integrations/cover.mqtt/
   */
  cover?: CoverItem | CoverItem[] | IncludeList;

  /**
   * The mqtt device tracker platform allows you to detect presence by monitoring an MQTT topic for new locations.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/
   */
  device_tracker?: DeviceTrackerItem | DeviceTrackerItem[] | IncludeList;

  /**
   * The mqtt fan platform lets you control your MQTT enabled fans.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/
   */
  fan?: FanItem | FanItem[] | IncludeList;

  /**
   * The mqtt humidifier platform lets you control your MQTT enabled humidifiers.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt
   */
  humidifier?: HumidifierItem | HumidifierItem[] | IncludeList;

  /**
   * The mqtt image platform allows you to integrate the content of an image file sent through MQTT into ApexOS as an image.
   * https://docs.apexinfosys.in/integrations/image.mqtt
   */
  image?: ImageItem | ImageItem[] | IncludeList;

  /**
   * The mqtt light platform lets you control your MQTT enabled lights through one of the supported message schemas, default, json or template.
   * https://docs.apexinfosys.in/integrations/light.mqtt/
   */
  light?:
    | LightDefaultItem
    | LightJSONItem
    | LightTemplateItem
    | (LightDefaultItem | LightDefaultItem | LightTemplateItem)[]
    | IncludeList;

  /**
   * The mqtt lock platform lets you control your MQTT enabled locks.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/
   */
  lock?: LockItem | LockItem[] | IncludeList;

  /**
   * The MQTT number platform.
   * https://docs.apexinfosys.in/integrations/number.mqtt/
   */
  number?: NumberItem | NumberItem[] | IncludeList;

  /**
   * The mqtt scene platform lets you control your MQTT enabled scenes.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/
   */
  scene?: SceneItem | SceneItem[] | IncludeList;

  /**
   * This mqtt select platform uses the MQTT message payload as the select value.
   * https://docs.apexinfosys.in/integrations/select.mqtt
   */
  select?: SelectItem | SelectItem[] | IncludeList;

  /**
   * The mqtt siren platform lets you control your MQTT enabled sirens and text based notification devices.
   * https://docs.apexinfosys.in/integrations/siren.mqtt
   */
  siren?: SirenItem | SirenItem[] | IncludeList;

  /**
   * This mqtt sensor platform uses the MQTT message payload as the sensor value.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt
   */
  sensor?: SensorItem | SensorItem[] | IncludeList;

  /**
   * The mqtt switch platform lets you control your MQTT enabled switches.
   * https://docs.apexinfosys.in/integrations/switch.mqtt
   */
  switch?: SwitchItem | SwitchItem[] | IncludeList;

  /**
   * The mqtt vacuum integration allows you to control your MQTT-enabled vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt
   */
  vacuum?:
    | VacuumItem
    | VacuumLegacyItem[]
    | (VacuumItem | VacuumLegacyItem)[]
    | IncludeList;
}

interface BaseItem {
  /**
   * A list of MQTT topics subscribed to receive availability (online/offline) updates.
   */
  availability?: Availability[];

  /**
   * When availability is configured, this controls the conditions needed to set the entity to available. Valid entries are all, any, and latest.
   */
  availability_mode?: AvailabilityMode;

  /**
   * Defines a template to extract device’s availability from the availability_topic. To determine the devices’s availability result of this template will be compared to payload_available and payload_not_available.
   */
  availability_template?: Template;

  /**
   * The MQTT topic subscribed to receive availability (online/offline) updates.
   */
  availability_topic?: string;

  /**
   * The payload that represents the available state.
   */
  payload_available?: string;

  /**
   * The payload that represents the unavailable state.
   */
  payload_not_available?: string;

  /**
   * Information about the device this sensor is a part of to tie it into the device registry. Only works through MQTT discovery and when unique_id is set.
   */
  device?: {
    /**
     * A link to the webpage that can manage the configuration of this device. Can be either an http://, https:// or an internal apexos:// URL
     */
    configuration_url?: string;

    /**
     * A list of connections of the device to the outside world as a list of tuples.
     */
    connections?: [connection_type: string, connection_identifier: string][];

    /**
     * The hardware version of the device.
     */
    hw_version?: string;

    /**
     * A list of IDs that uniquely identify the device. For example a serial number.
     */
    identifiers?: string | string[];

    /**
     * The manufacturer of the device.
     */
    manufacturer?: string;

    /**
     * The model of the device.
     */
    model?: string;

    /**
     * The model identifier of the device.
     */
    model_id?: string;

    /**
     * The name of the device.
     */
    name?: string;

    /**
     * The serial number of the device.
     */
    serial_number?: string;

    /**
     * Suggest an area if the device isn’t in one yet.
     */
    suggested_area?: string;

    /**
     * The firmware version of the device.
     */
    sw_version?: string;

    /**
     * Identifier of a device that routes messages between this device and ApexOS. Examples of such devices are hubs, or parent devices of a sub-device.
     */
    via_device?: string;
  };

  /**
   * Flag which defines if the entity should be enabled when first added.
   */
  enabled_by_default?: boolean;

  /**
   * The category of the entity. When set, the entity category must be "diagnostic" for sensors.
   */
  entity_category?: "diagnostic" | "config";

  /**
   * Icon to use for the entity created.
   */
  icon?: string;

  /**
   * Defines a template to extract the JSON dictionary from messages received on the json_attributes_topic.
   */
  json_attributes_template?: Template;

  /**
   * The MQTT topic subscribed to receive a JSON dictionary payload and then set as sensor attributes.
   */
  json_attributes_topic?: string;

  /**
   * An ID that uniquely identifies this sensor. If two sensors have the same unique ID, ApexOS will raise an exception.
   */
  object_id?: string;

  /**
   * An ID that uniquely identifies this sensor. If two sensors have the same unique ID, ApexOS will raise an exception.
   */
  unique_id?: string;
}

export interface AlarmControlPanelItem extends BaseItem {
  /**
   * If defined, specifies a code to enable or disable the alarm in the frontend.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#code
   */
  code?: string;

  /**
   * If true the code is required to arm the alarm. If false the code is not validated.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#code_arm_required
   */
  code_arm_required?: boolean;

  /**
   * If true the code is required to disarm the alarm. If false the code is not validated.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#code_disarm_required
   */
  code_disarm_required?: boolean;

  /**
   * If true the code is required to trigger the alarm. If false the code is not validated.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#code_trigger_required
   */
  code_trigger_required?: boolean;

  /**
   * The template used for the command payload. Available variables: action and code.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#command_template
   */
  command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the alarm state.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * The encoding of the payloads received and published messages. Set to "" to disable decoding of incoming payload.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#encoding
   */
  encoding?: string;

  /**
   * Picture URL for the entity.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#entity_picture
   */
  entity_picture?: string;

  /**
   * The name of the MQTT alarm.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#name
   */
  name?: string;

  /**
   * The payload to set armed-away mode on your Alarm Panel.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#payload_arm_away
   */
  payload_arm_away?: string;

  /**
   * The payload to set armed-home mode on your Alarm Panel.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#payload_arm_home
   */
  payload_arm_home?: string;

  /**
   * The payload to set armed-night mode on your Alarm Panel.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#payload_arm_night
   */
  payload_arm_night?: string;

  /**
   * The payload to set armed-vacation mode on your Alarm Panel.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#payload_arm_vacation
   */
  payload_arm_vacation?: string;

  /**
   * The payload to set armed-custom-bypass mode on your Alarm Panel.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#payload_arm_custom_bypass
   */
  payload_arm_custom_bypass?: string;

  /**
   * The payload to disarm your Alarm Panel.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#payload_disarm
   */
  payload_disarm?: string;

  /**
   * The payload to trigger the alarm on your Alarm Panel.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#payload_trigger
   */
  payload_trigger?: string;

  /**
   * The maximum QoS level of the state topic.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Set the retain flag for data from the alarm panel.
   * Retain is enabled by default.
   */
  retain?: boolean;

  /**
   * The MQTT topic subscribed to receive sensor's state.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#state_topic
   */
  state_topic: string;

  /**
   * A list of features that the alarm control panel supports.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#supported_features
   */
  supported_features?: ("arm_home" | "arm_away" | "arm_night" | "arm_vacation" | "arm_custom_bypass" | "trigger")[];

  /**
   * Defines a template to extract the value.
   * https://docs.apexinfosys.in/integrations/alarm_control_panel.mqtt/#value_template
   */
  value_template?: Template;
}

export interface BinarySensorItem extends BaseItem {
  /**
   * The type/class of the sensor to set the icon in the frontend.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#device_class
   */
  device_class?: DeviceClassesBinarySensor;

  /**
   * The encoding of the payloads received. Set to "" to disable decoding of incoming payload.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#encoding
   */
  encoding?: string;

  /**
   * Picture URL for the entity.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#entity_picture
   */
  entity_picture?: string;

  /**
   * Defines the number of seconds after the sensor’s state expires, if it’s not updated. After expiry, the sensor’s state becomes unavailable.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#expire_after
   */
  expire_after?: PositiveInteger;

  /**
   * Sends update events even if the value hasn’t changed. Useful if you want to have meaningful value graphs in history.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#expire_after
   */
  force_update?: boolean;

  /**
   * The name of the MQTT binary sensor. Can be set to null if only the device name is relevant.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#name
   */
  name?: string | null;

  /**
   * For sensors that only send on state updates (like PIRs), this variable sets a delay in seconds after which the sensor’s state will be updated back to off.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#off_delay
   */
  off_delay?: PositiveInteger;

  /**
   * The string that represents the off state. It will be compared to the message in the state_topic.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt/#payload_off
   */
  payload_off?: string;

  /**
   * The string that represents the on state. It will be compared to the message in the state_topic.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt/#payload_on
   */
  payload_on?: string;

  /**
   * Must be binary_sensor. Only allowed and required in MQTT auto discovery device messages.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#platform
   */
  platform?: "binary_sensor";

  /**
   * The maximum QoS level of the state topic.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#qos
   */
  qos?: QOS;

  /**
   * The MQTT topic subscribed to receive sensor's state.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#state_topic
   */
  state_topic: string;

  /**
   * Defines a template to extract the value.
   * https://docs.apexinfosys.in/integrations/binary_sensor.mqtt#value_template
   */
  value_template?: Template;
}

export interface ButtonItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to trigger the button.
   * https://docs.apexinfosys.in/integrations/button.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * Defines a template to generate the payload to send to command_topic.
   * https://docs.apexinfosys.in/integrations/button.mqtt/#command_template
   */
  command_template?: Template;

  /**
   * Sets the class of the device, changing the device state and icon that is displayed in the frontend.
   * https://docs.apexinfosys.in/integrations/button.mqtt/#device_class
   */
  device_class?: string;

  /**
   * The name of the MQTT button.
   * https://docs.apexinfosys.in/integrations/button.mqtt/#name
   */
  name?: string;

  /**
   * The payload to send to trigger the button.
   * https://docs.apexinfosys.in/integrations/button.mqtt/#payload_press
   */
  payload_press?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/button.mqtt/#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/button.mqtt/#retain
   */
  retain?: boolean;
}

export interface CameraItem extends BaseItem {
  /**
   * The name of the MQTT camera.
   * https://docs.apexinfosys.in/integrations/camera.mqtt#name
   */
  name?: string;

  /**
   * The MQTT topic to subscribe to.
   * https://docs.apexinfosys.in/integrations/camera.mqtt/#device
   */
  topic: string;
}

export interface ClimateItem extends BaseItem {
  /**
   * A template to render the value received on the action_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#action_template
   */
  action_template?: Template;

  /**
   * The MQTT topic to subscribe for changes of the current action. If this is set, the climate graph uses the value received as data source. Valid values: off, heating, cooling, drying, idle, fan.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#action_topic
   */
  action_topic?: string;

  /**
   * The MQTT topic to publish commands to switch auxiliary heat.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#aux_command_topic
   */
  aux_command_topic?: string;

  /**
   * A template to render the value received on the aux_state_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#aux_state_template
   */
  aux_state_template?: Template;

  /**
   * The MQTT topic to subscribe for changes of the auxiliary heat mode. If this is not set, the auxiliary heat mode works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#aux_state_topic
   */
  aux_state_topic?: string;

  /**
   * A template with which the value received on current_temperature_topic will be rendered.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#current_temperature_template
   */
  current_temperature_template?: Template;

  /**
   * The MQTT topic on which to listen for the current temperature.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#current_temperature_topic
   */
  current_temperature_topic?: string;

  /**
   * The encoding of the payloads received and published messages. Set to "" to disable decoding of incoming payload.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#encoding
   */
  encoding?: string;

  /**
   * A template to render the value sent to the fan_mode_command_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#fan_mode_command_template
   */
  fan_mode_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the fan mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#fan_mode_command_topic
   */
  fan_mode_command_topic?: string;

  /**
   * A template to render the value received on the fan_mode_state_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#fan_mode_state_template
   */
  fan_mode_state_template?: Template;

  /**
   * The MQTT topic to subscribe for changes of the HVAC fan mode. If this is not set, the fan mode works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#fan_mode_state_topic
   */
  fan_mode_state_topic?: string;

  /**
   * A list of supported fan modes.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#fan_modes
   */
  fan_modes?: string[];

  /**
   * Set the initial target temperature.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#initial
   */
  initial?: Integer;

  /**
   * Maximum set point available.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#max_temp
   */
  max_temp?: number;

  /**
   * Minimum set point available.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#min_temp
   */
  min_temp?: number;

  /**
   * A template to render the value sent to the mode_command_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#mode_command_template
   */
  mode_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the HVAC operation mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#mode_command_topic
   */
  mode_command_topic?: string;

  /**
   * A template to render the value received on the mode_state_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#mode_state_template
   */
  mode_state_template?: Template;

  /**
   * The MQTT topic to subscribe for changes of the HVAC operation mode. If this is not set, the operation mode works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#mode_state_topic
   */
  mode_state_topic?: string;

  /**
   * A list of supported modes. Needs to be a subset of the default values.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#modes
   */
  modes?: ("auto" | "off" | "cool" | "heat" | "dry" | "fan_only")[];

  /**
   * The name of the HVAC.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#name
   */
  name?: string;

  /**
   * The payload that represents disabled state.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#payload_off
   */
  payload_off?: string;

  /**
   * The payload that represents enabled state.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#payload_on
   */
  payload_on?: string;

  /**
   * The MQTT topic to publish commands to change the power state. This is useful if your device has a separate power toggle in addition to mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#power_command_topic
   */
  power_command_topic?: string;

  /**
   * The desired precision for this device. Can be used to match your actual thermostat’s precision. Supported values are 0.1, 0.5 and 1.0.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#precision
   */
  precision?: 0.1 | 0.5 | 1.0;

  /**
   * Defines a template to generate the payload to send to preset_mode_command_topic.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#preset_mode_command_template
   */
  preset_mode_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the preset mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#preset_mode_command_topic
   */
  preset_mode_command_topic?: string;
  /**
   * The MQTT topic subscribed to receive climate speed based on presets. When preset ‘none’ is received or None the preset_mode will be reset.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#preset_mode_state_topic
   */
  preset_mode_state_topic?: string;

  /**
   * Defines a template to extract the preset_mode value from the payload received on preset_mode_state_topic.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#preset_mode_value_template
   */
  preset_mode_value_template?: string;

  /**
   * List of preset modes this climate is supporting. Common examples include eco, away, boost, comfort, home, sleep and activity.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#preset_modes
   */
  preset_modes?: string[];

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Defines if published messages should have the retain flag set.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#retain
   */
  retain?: boolean;

  /**
   * A template to render the value sent to the swing_mode_command_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#swing_mode_command_template
   */
  swing_mode_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the swing mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#swing_mode_command_topic
   */
  swing_mode_command_topic?: string;

  /**
   * A template to render the value received on the swing_mode_state_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#swing_mode_state_template
   */
  swing_mode_state_template?: Template;

  /**
   * The MQTT topic to subscribe for changes of the HVAC swing mode. If this is not set, the swing mode works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#swing_mode_state_topic
   */
  swing_mode_state_topic?: string;

  /**
   * A list of supported swing modes.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#swing_modes
   */
  swing_modes?: string[];

  /**
   * A template to render the value sent to the temperature_command_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#temperature_command_template
   */
  temperature_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the target temperature.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_command_topic
   */
  temperature_command_topic?: string;

  /**
   * A template to render the value sent to the temperature_high_command_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#temperature_high_command_template
   */
  temperature_high_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the high target temperature.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_high_command_topic
   */
  temperature_high_command_topic?: string;

  /**
   * A template to render the value received on the temperature_high_state_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_high_state_template
   */
  temperature_high_state_template?: Template;

  /**
   * The MQTT topic to subscribe for changes in the target high temperature. If this is not set, the target high temperature works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_high_state_topic
   */
  temperature_high_state_topic?: string;

  /**
   * A template to render the value sent to the temperature_high_command_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt/#temperature_high_command_template
   */
  temperature_low_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the target low temperature.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_low_command_topic
   */
  temperature_low_command_topic?: string;

  /**
   * A template to render the value received on the temperature_low_state_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_low_state_template
   */
  temperature_low_state_template?: Template;

  /**
   * The MQTT topic to subscribe for changes in the target low temperature. If this is not set, the target low temperature works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_low_state_topic
   */
  temperature_low_state_topic?: string;

  /**
   * A template to render the value received on the temperature_state_topic with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_state_template
   */
  temperature_state_template?: Template;

  /**
   * The MQTT topic to subscribe for changes in the target temperature. If this is not set, the target temperature works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_state_topic
   */
  temperature_state_topic?: string;

  /**
   * Defines the temperature unit of the device, C or F. If this is not set, the temperature unit is set to the system temperature unit.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temperature_unit
   */
  temperature_unit?: "C" | "F";

  /**
   * Step size for temperature set point.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#temp_step
   */
  temp_step?: number;

  /**
   * Default template to render the payloads on all *_state_topics with.
   * https://docs.apexinfosys.in/integrations/climate.mqtt#value_template
   */
  value_template?: Template;
}

export interface CoverItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to control the cover.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#command_topic
   */
  command_topic?: string;

  /**
   * Sets the class of the device, changing the device state and icon that is displayed on the frontend.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#device_class
   */
  device_class?: DeviceClassesCover;

  /**
   * The name of the MQTT cover.
   * https://docs.apexinfosys.in/integrations/cover.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if switch works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The command payload that closes the cover.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#payload_close
   */
  payload_close?: string;

  /**
   * The command payload that opens the cover.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#payload_open
   */
  payload_open?: string;

  /**
   * The command payload that stops the cover.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#payload_stop
   */
  payload_stop?: string;

  /**
   * Number which represents closed position.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#position_closed
   */
  position_closed?: Integer;

  /**
   * Number which represents open position.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#position_open
   */
  position_open?: Integer;

  /**
   * Defines a template that can be used to extract the payload for the `position_topic` topic.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#position_template
   */
  position_template?: Template;

  /**
   * The MQTT topic subscribed to receive cover position messages. If position_topic is set state_topic is ignored.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#position_topic
   */
  position_topic?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Defines if published messages should have the retain flag set.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#retain
   */
  retain?: boolean;

  /**
   * Defines a template to define the position to be sent to the set_position_topic topic.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#set_position_template
   */
  set_position_template?: Template;

  /**
   * The MQTT topic to publish position commands to. You need to set position_topic as well if you want to use position topic.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#set_position_topic
   */
  set_position_topic?: string;

  /**
   * The payload that represents the closed state.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#state_closed
   */
  state_closed?: string;

  /**
   * The payload that represents the closing state.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#state_closing
   */
  state_closing?: string;

  /**
   * The payload that represents the open state.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#state_open
   */
  state_open?: string;

  /**
   * The payload that represents the opening state.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#state_opening
   */
  state_opening?: string;

  /**
   * The payload that represents the stopped state (for covers that do not report open/closed state).
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#state_stopped
   */
  state_stopped?: string;

  /**
   * The MQTT topic subscribed to receive cover state messages. Use only if not using position_topic. State topic can only read open/close state.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * The value that will be sent on a close_cover_tilt command.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_closed_value
   */
  tilt_closed_value?: Integer;

  /**
   * Defines a template that can be used to extract the payload for the `tilt_command_topic` topic.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_command_template
   */
  tilt_command_template?: Template;

  /**
   * The MQTT topic to publish commands to control the cover tilt.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_command_topic
   */
  tilt_command_topic?: string;

  /**
   *The maximum tilt value.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_max
   */
  tilt_max?: Integer;

  /**
   * The minimum tilt value.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_min
   */
  tilt_min?: Integer;

  /**
   * The value that will be sent on an open_cover_tilt command.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_opened_value
   */
  tilt_opened_value?: Integer;

  /**
   * Flag that determines if tilt works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_optimistic
   */
  tilt_optimistic?: boolean;

  /**
   * Defines a template that can be used to extract the payload for the tilt_status_topic topic.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_status_template
   */
  tilt_status_template?: Template;

  /**
   * The MQTT topic subscribed to receive tilt status update values.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#tilt_status_topic
   */
  tilt_status_topic?: string;

  /**
   * Defines a template to extract a value from the payload.
   * https://docs.apexinfosys.in/integrations/cover.mqtt/#value_template
   */
  value_template?: Template;
}

export interface DeviceTrackerItem extends BaseItem {
  /**
   * The MQTT topic subscribed to receive device tracker state changes.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * Defines a template that returns a device tracker state.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#value_template
   */
  value_template?: Template;

  /**
   * The payload value that represents the ‘home’ state for the device.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#payload_home
   */
  payload_home?: string;

  /**
   * The payload value that represents the ‘not_home’ state for the device.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#payload_not_home
   */
  payload_not_home?: string;

  /**
   * The payload value that will have the device’s location automatically derived from ApexOS’s zones.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#payload_reset
   */
  payload_reset?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Attribute of a device tracker that affects state when being used to track a person. Valid options are gps, router, bluetooth, or bluetooth_le.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#source_type
   */
  source_type?: "bluetooth" | "bluetooth_le" | "gps" | "router";

  /**
   * The name of the MQTT device_tracker.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#name
   */
  name?: string;

  /**
   * Used instead of `name` for automatic generation of `entity_id`.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#object_id
   */
  object_id?: string;

  /**
   * An ID that uniquely identifies this device_tracker. If two device_trackers have the same unique ID, ApexOS will raise an exception.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#unique_id
   */
  unique_id?: string;

  /**
   * Must be `device_tracker`. Only allowed and required in MQTT auto discovery device messages.
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#platform
   */
  platform?: string;

  /**
   * List of devices with their topic (legacy YAML configuration).
   * https://docs.apexinfosys.in/integrations/device_tracker.mqtt/#devices
   */
  devices?: { [key: string]: string };
}

export interface FanItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to change the fan state.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * The template used for the command payload.
   * https://docs.apexinfosys.in/integrations/fan.mqt/#command_template
   */
  command_template?: Template;

  /**
   * The name of the MQTT fan.
   * https://docs.apexinfosys.in/integrations/fan.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if fan works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * Defines a template to generate the payload to send to `direction_command_template`.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#direction_command_template
   */
  direction_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the fan direction state based on a value.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#direction_command_topic
   */
  direction_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive fan direction.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#direction_state_topic
   */
  direction_state_topic?: string;

  /**
   * Defines a template to extract a value from fan direction.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#direction_value_template
   */
  direction_value_template?: Template;

  /**
   * Defines a template to generate the payload to send to oscillation_command_topic.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#oscillation_value_template
   */
  oscillation_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the oscillation state.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#oscillation_command_topic
   */
  oscillation_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive oscillation state updates.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#oscillation_state_topic
   */
  oscillation_state_topic?: string;

  /**
   * Defines a template to extract a value from the oscillation.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#oscillation_value_template
   */
  oscillation_value_template?: Template;

  /**
   * The payload that represents the stop state.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#payload_off
   */
  payload_off?: string;

  /**
   * The payload that represents the running state.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#payload_on
   */
  payload_on?: string;

  /**
   * The payload that represents the oscillation off state.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#payload_oscillation_off
   */
  payload_oscillation_off?: string;

  /**
   * The payload that represents the oscillation on state.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#payload_oscillation_on
   */
  payload_oscillation_on?: string;

  /**
   * A special payload that resets the `percentage` state attribute to `None` when received at the `percentage_state_topic`.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#payload_reset_percentage
   */
  payload_reset_percentage?: string;

  /**
   * A special payload that resets the `preset_mode` state attribute to `None` when received at the `preset_mode_state_topic`.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#payload_reset_preset_mode
   */
  payload_reset_preset_mode?: string;

  /**
   * Defines a template to generate the payload to send to `percentage_command_topic`.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#percentage_command_template
   */
  percentage_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the fan speed state based on a percentage.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#percentage_command_topic
   */
  percentage_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive fan speed based on percentage.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#percentage_state_topic
   */
  percentage_state_topic?: string;

  /**
   * Defines a template to extract a value from fan percentage speed.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#percentage_value_template
   */
  percentage_value_template?: string;

  /**
   * Defines a template to generate the payload to send to preset_mode_command_topic.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#preset_mode_command_template
   */
  preset_mode_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the preset mode.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#preset_mode_command_topic
   */
  preset_mode_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive fan speed based on presets.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#preset_mode_state_topic
   */
  preset_mode_state_topic?: string;

  /**
   * Defines a template to extract a value from the preset_mode payload.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#preset_mode_value_template
   */
  preset_mode_value_template?: string;

  /**
   * List of preset modes this fan is capable of running at.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#preset_modes
   */
  preset_modes?: string[];

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Defines if published messages should have the retain flag set.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The minimum of numeric output range (off not included, so speed_range_min - 1 represents 0%).
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#speed_range_min
   */
  speed_range_min?: PositiveInteger;

  /**
   * The maximum of numeric output range (representing 100%).
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#speed_range_max
   */
  speed_range_max?: PositiveInteger;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * Defines a template to extract a value from the state.
   * https://docs.apexinfosys.in/integrations/fan.mqtt/#state_value_template
   */
  state_value_template?: Template;
}

export interface HumidifierItem extends BaseItem {
  /**
   * The MQTT topic to subscribe for changes of the current action.
   * Valid values: `off`, `humidifying`, `drying`, `idle`
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  action_topic?: string;

  /**
   * A template to render the value received on the `action_topic` with.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  action_template?: Template;

  /**
   * Defines a template to generate the payload to send to `command_topic`.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the humidifier state.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  command_topic: string;

  /**
   * A template with which the value received on `current_humidity_topic` will be rendered.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  current_humidity_template?: Template;

  /**
   * The MQTT topic on which to listen for the current humidity.
   * A `"None"` value received will reset the current humidity. Empty values (`'''`) will be ignored.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  current_humidity_topic?: string;

  /**
   * The device class of the MQTT device.
   * Must be either `humidifier`, `dehumidifier` or `null`.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  device_class?: "humidifier" | "dehumidifier" | null;

  /**
   * The encoding of the payloads received and published messages.
   * Set to `""` to disable decoding of incoming payload.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  encoding?: string;

  /**
   * Picture URL for the entity.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  entity_picture?: string;

  /**
   * The maximum target humidity percentage that can be set.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  max_humidity?: number;

  /**
   * The minimum target humidity percentage that can be set.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  min_humidity?: number;

  /**
   * Defines a template to generate the payload to send to `mode_command_topic`.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  mode_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the `mode` on the humidifier.
   * This attribute must be configured together with the `modes` attribute.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  mode_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive the humidifier `mode`.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  mode_state_topic?: string;

  /**
   * Defines a template to extract a value for the humidifier `mode` state.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  mode_state_template?: Template;

  /**
   * List of available modes this humidifier is capable of running at.
   * Common examples include `normal`, `eco`, `away`, `boost`, `comfort`, `home`, `sleep`, `auto` and `baby`.
   * This attribute must be configured together with the `mode_command_topic` attribute.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  modes?: string[];

  /**
   * The name of the humidifier.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  name?: string;

  /**
   * Flag that defines if humidifier works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  optimistic?: boolean;

  /**
   * The payload that represents the stop state.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  payload_off?: string;

  /**
   * The payload that represents the running state.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  payload_on?: string;

  /**
   * A special payload that resets the `target_humidity` state attribute to an `unknown` state when received at the `target_humidity_state_topic`.
   * When received at `current_humidity_topic` it will reset the current humidity state.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  payload_reset_humidity?: string;

  /**
   * A special payload that resets the `mode` state attribute to an `unknown` state when received at the `mode_state_topic`.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  payload_reset_mode?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  retain?: boolean;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  state_topic?: string;

  /**
   * Defines a template to extract a value from the state.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  state_value_template?: Template;

  /**
   * Defines a template to generate the payload to send to `target_humidity_command_topic`.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  target_humidity_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the humidifier target humidity state based on a percentage.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  target_humidity_command_topic: string;

  /**
   * The MQTT topic subscribed to receive humidifier target humidity.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  target_humidity_state_topic?: string;

  /**
   * Defines a template to extract a value for the humidifier `target_humidity` state.
   * https://docs.apexinfosys.in/integrations/humidifier.mqtt/
   */
  target_humidity_state_template?: Template;
}

export interface ImageItem extends BaseItem {
  /**
   * The name of the MQTT image.
   * https://docs.apexinfosys.in/integrations/image.mqtt#name
   */
  name?: string;

  /**
   * The content type of an image data message received on image_topic.
   * https://docs.apexinfosys.in/integrations/image.mqtt#content_type
   */
  content_type?: string;

  /**
   * The encoding of the image payloads received.
   * https://docs.apexinfosys.in/integrations/image.mqtt#image_encoding
   */
  image_encoding?: string;

  /**
   * The MQTT topic to subscribe to receive the image payload of the image to be downloaded.
   * https://docs.apexinfosys.in/integrations/image.mqtt#image_topic
   */
  image_topic?: string;

  /**
   * Defines a template to extract the image URL from a message received at url_topic.
   * https://docs.apexinfosys.in/integrations/image.mqtt#url_template
   */
  url_template?: Template;

  /**
   * The MQTT topic to subscribe to receive an image URL.
   * https://docs.apexinfosys.in/integrations/image.mqtt#url_topic
   */
  url_topic?: string;
}

export interface LightDefaultItem extends BaseItem {
  /**
   * The mqtt light platform with default schema lets you control your MQTT enabled lights. It supports setting brightness, color temperature, effects, flashing, on/off, RGB colors, transitions, XY colors and white values.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#default-schema---configuration
   */
  schema?: "default";

  /**
   * The MQTT topic to publish commands to change the light’s brightness.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#brightness_command_topic
   */
  brightness_command_topic?: string;

  /**
   * Defines the maximum brightness value (i.e., 100%) of the MQTT device.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#brightness_scale
   */
  brightness_scale?: Integer;

  /**
   * The MQTT topic subscribed to receive brightness state updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#brightness_state_topic
   */
  brightness_state_topic?: string;

  /**
   * Defines a template to extract the brightness value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#brightness_value_template
   */
  brightness_value_template?: Template;

  /**
   * The MQTT topic subscribed to receive color mode updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_mode_state_topic
   */
  color_mode_state_topic?: string;

  /**
   * Defines a template to extract the color mode.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_mode_value_template
   */
  color_mode_value_template?: Template;

  /**
   * Defines a template to compose message which will be sent to color_temp_command_topic. Available variables: value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_temp_command_template
   */
  color_temp_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the light’s color temperature state. The color temperature command slider has a range of 153 to 500 mireds (micro reciprocal degrees).
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_temp_command_topic
   */
  color_temp_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive color temperature state updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_temp_state_topic
   */
  color_temp_state_topic?: string;

  /**
   * Defines a template to extract the color temperature value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_temp_value_template
   */
  color_temp_value_template?: Template;

  /**
   * The MQTT topic to publish commands to change the switch state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * The MQTT topic to publish commands to change the light’s effect state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect_command_topic
   */
  effect_command_topic?: string;

  /**
   * The list of effects the light supports.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect_list
   */
  effect_list?: string | string[];

  /**
   * The MQTT topic subscribed to receive effect state updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect_state_topic
   */
  effect_state_topic?: string;

  /**
   * Defines a template to extract the effect value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect_value_template
   */
  effect_value_template?: Template;

  /**
   * The MQTT topic to publish commands to change the light’s color state in HS format (Hue Saturation). Range for Hue: 0° .. 360°, Range of Saturation: 0..100.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#hs_command_topic
   */
  hs_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive color state updates in HS format.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#hs_state_topic
   */
  hs_state_topic?: string;

  /**
   * Defines a template to extract the HS value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#hs_value_template
   */
  hs_value_template?: Template;

  /**
   * The maximum color temperature in mireds.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#max_mireds
   */
  max_mireds?: Integer;

  /**
   * The minimum color temperature in mireds.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#min_mireds
   */
  min_mireds?: Integer;

  /**
   * The name of the MQTT light.
   * https://docs.apexinfosys.in/integrations/light.mqtt#name
   */
  name?: string;

  /**
   * Defines when on the payload_on is sent. Using last (the default) will send any style (brightness, color, etc) topics first and then a payload_on to the command_topic.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#on_command_type
   */
  on_command_type?: string;

  /**
   * Flag that defines if light works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The payload that represents disabled state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#payload_off
   */
  payload_off?: string;

  /**
   * The payload that represents enabled state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#payload_on
   */
  payload_on?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Defines if published messages should have the retain flag set.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#retain
   */
  retain?: boolean;

  /**
   * Defines a template to compose message which will be sent to rgb_command_topic. Available variables: red, green and blue.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#rgb_command_template
   */
  rgb_command_template?: Template;

  /**
   * The MQTT topic to publish commands to change the light’s RGB state. Please note that the color value sent by ApexOS is normalized to full brightness if brightness_command_topic is set.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#rgb_command_topic
   */
  rgb_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive RGB state updates. The expected payload is the RGB values separated by commas, for example, 255,0,127.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#rgb_state_topic
   */
  rgb_state_topic?: string;

  /**
   * Defines a template to extract the RGB value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#rgb_value_template
   */
  rgb_value_template?: Template;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * Defines a template to extract a value from the state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#state_value_template
   */
  state_value_template?: Template;

  /**
   * The MQTT topic to publish commands to change the light to white mode with a given brightness.
   * https://docs.apexinfosys.in/integrations/light.mqtt#white_command_topic
   */
  white_command_topic?: string;

  /**
   * Defines the maximum white level (i.e., 100%) of the MQTT device.
   * https://docs.apexinfosys.in/integrations/light.mqtt#white_scale
   */
  white_scale?: Integer;

  /**
   * The MQTT topic to publish commands to change the light’s XY state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#xy_command_topic
   */
  xy_command_topic?: string;

  /**
   * The MQTT topic subscribed to receive XY state updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#xy_state_topic
   */
  xy_state_topic?: string;

  /**
   * Defines a template to extract the XY value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#xy_value_template
   */
  xy_value_template?: Template;
}

export interface LightJSONItem extends BaseItem {
  /**
   * The mqtt light platform with default schema lets you control your MQTT enabled lights. It supports setting brightness, color temperature, effects, flashing, on/off, RGB colors, transitions, XY colors and white values.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#json-schema---configuration
   */
  schema?: "json";

  /**
   * Flag that defines if the light supports brightness.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#brightness
   */
  brightness?: boolean;

  /**
   * Defines the maximum brightness value (i.e., 100%) of the MQTT device.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#brightness_scale
   */
  brightness_scale?: Integer;

  /**
   * Flag that defines if the light supports color modes.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color
   */
  color_mode?: boolean;

  /**
   * Flag that defines if the light supports color temperature.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_temp
   */
  color_temp?: boolean;

  /**
   * The MQTT topic to publish commands to change the switch state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * Flag that defines if the light supports effects.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect
   */
  effect?: boolean;

  /**
   * The list of effects the light supports.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect_list
   */
  effect_list?: string | string[];

  /**
   * The duration, in seconds, of a “long” flash.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#flash_time_long
   */
  flash_time_long?: Integer;

  /**
   * The duration, in seconds, of a “short” flash.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#flash_time_short
   */
  flash_time_short?: Integer;

  /**
   * Flag that defines if the light supports HS colors.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#hs
   */
  hs?: boolean;

  /**
   * The maximum color temperature in mireds.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#max_mireds
   */
  max_mireds?: Integer;

  /**
   * The minimum color temperature in mireds.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#min_mireds
   */
  min_mireds?: Integer;

  /**
   * The name of the MQTT light.
   * https://docs.apexinfosys.in/integrations/light.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if light works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Defines if published messages should have the retain flag set.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#retain
   */
  retain?: boolean;

  /**
   * Flag that defines if the light supports RGB colors.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#rgb
   */
  rgb?: boolean;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * A list of color modes supported by the light.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#supported_color_modes
   */
  supported_color_modes?: ColorMode[];

  /**
   * Flag that defines if the light supports white values.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#white_value
   */
  white_value?: boolean;

  /**
   * Flag that defines if the light supports XY colors.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#xy
   */
  xy?: boolean;
}

export interface LightTemplateItem extends BaseItem {
  /**
   * The mqtt light platform with default schema lets you control your MQTT enabled lights. It supports setting brightness, color temperature, effects, flashing, on/off, RGB colors, transitions, XY colors and white values.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#json-schema---configuration
   */
  schema?: "template";

  /**
   * Template to extract blue color from the state payload value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#blue_template
   */
  blue_template?: Template;

  /**
   * Template to extract brightness from the state payload value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#brightness_template
   */
  brightness_template?: Template;

  /**
   * Template to extract color temperature from the state payload value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#color_temp_template
   */
  color_temp_template?: Template;

  /**
   * The template for off state changes. Available variables: state and transition.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#command_off_template
   */
  command_off_template: Template;

  /**
   * The template for on state changes. Available variables: state, brightness, red, green, blue, white_value, flash, transition and effect.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#command_on_template
   */
  command_on_template: Template;

  /**
   * The MQTT topic to publish commands to change the switch state.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * The list of effects the light supports.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect_list
   */
  effect_list?: string | string[];

  /**
   * Template to extract effect from the state payload value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#effect_template
   */
  effect_template?: Template;

  /**
   * Template to extract green color from the state payload value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#green_template
   */
  green_template?: Template;

  /**
   * The maximum color temperature in mireds.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#max_mireds
   */
  max_mireds?: Integer;

  /**
   * The minimum color temperature in mireds.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#min_mireds
   */
  min_mireds?: Integer;

  /**
   * The name of the MQTT light.
   * https://docs.apexinfosys.in/integrations/light.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if light works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#qos
   */
  qos?: QOS;

  /**
   * Template to extract red color from the state payload value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#red_template
   */
  red_template?: string;

  /**
   * Template to extract red color from the state payload value.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#state_template
   */
  state_template?: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/light.mqtt/#state_topic
   */
  state_topic?: string;
}

export interface LockItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to change the lock state.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * The name of the MQTT lock.
   * https://docs.apexinfosys.in/integrations/lock.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if lock works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The payload that represents enabled/locked state.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#payload_lock
   */
  payload_lock?: string;

  /**
   * The value that represents the lock to be in unlocked state.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#state_unlocked
   */
  payload_unlock?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The value that represents the lock to be in locked state.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#state_locked
   */
  state_locked?: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * The value that represents the lock to be in unlocked state.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#state_unlocked
   */
  state_unlocked?: string;

  /**
   * Defines a template to extract a value from the payload.
   * https://docs.apexinfosys.in/integrations/lock.mqtt/#value_template
   */
  value_template?: Template;
}

export interface NumberItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to change the number state.
   * https://docs.apexinfosys.in/integrations/number.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * Maximum value.
   * https://docs.apexinfosys.in/integrations/number.mqtt#max
   */
  max?: number;

  /**
   * Minimum value.
   * https://docs.apexinfosys.in/integrations/number.mqtt#min
   */
  min?: number;

  /**
   * The name of the MQTT number.
   * https://docs.apexinfosys.in/integrations/number.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if the number works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/number.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/number.mqtt/#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/number.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/number.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * Step value. Smallest value `0.001`.
   * https://docs.apexinfosys.in/integrations/number.mqtt/#step
   */
  step?: number;

  /**
   * Defines the units of measurement, if any.
   * https://docs.apexinfosys.in/integrations/number.mqtt#unit_of_measurement
   */
  unit_of_measurement?: string;

  /**
   * Defines a template to extract the value.
   * https://docs.apexinfosys.in/integrations/number.mqtt#value_template
   */
  value_template?: Template;
}

export interface SceneItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to change the scene state.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * The name of the MQTT scene.
   * https://docs.apexinfosys.in/integrations/scene.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if the scene works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The payload that represents the scene.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/#payload
   */
  payload?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * Defines a template to extract a value from the state payload.
   * https://docs.apexinfosys.in/integrations/scene.mqtt/#value_template
   */
  
  value_template?: Template;
}

export interface SelectItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to control the select.
   * https://docs.apexinfosys.in/integrations/select.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * The name of the MQTT select.
   * https://docs.apexinfosys.in/integrations/select.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines the select works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/select.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * List of options to choose from in the select.
   * https://docs.apexinfosys.in/integrations/select.mqtt/#options
   */
  options?: string[];

  /**
   * The maximum QoS level of the state topic.
   * https://docs.apexinfosys.in/integrations/select.mqtt#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/select.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The MQTT topic subscribed to receive the select value.
   * https://docs.apexinfosys.in/integrations/select.mqtt#state_topic
   */
  state_topic?: string;

  /**
   * Defines a template to extract a value from the payload.
   * https://docs.apexinfosys.in/integrations/select.mqtt/#value_template
   */
  value_template?: Template;
}

export interface SensorItem extends BaseItem {
  /**
   * The type/class of the sensor to set the icon in the frontend.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#device_class
   */
  device_class?: DeviceClassesSensor;

  /**
   * The encoding of the payloads received. Set to "" to disable decoding of incoming payload.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#encoding
   */
  encoding?: string;

  /**
   * Picture URL for the entity.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#entity_picture
   */
  entity_picture?: string;

  /**
   * Defines the number of seconds after the sensor’s state expires, if it’s not updated. After expiry, the sensor’s state becomes unavailable.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#expire_after
   */
  expire_after?: PositiveInteger;

  /**
   * Sends update events even if the value hasn’t changed. Useful if you want to have meaningful value graphs in history.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#expire_after
   */
  force_update?: boolean;

  /**
   * The MQTT topic subscribed to receive timestamps for when an accumulating sensor such as an energy meter was reset. If the sensor never resets, set last_reset_topic to same as state_topic and set the last_reset_value_template to a constant valid timstamp, for example UNIX epoch 0: 1970-01-01T00:00:00+00:00.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#last_reset_topic
   */
  last_reset_topic?: string;

  /**
   * Defines a template to extract the last_reset. Available variables: entity_id. The entity_id can be used to reference the entity’s attributes.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#last_reset_value_template
   */
  last_reset_value_template?: Template;

  /**
   * The name of the MQTT sensor. Can be set to null if only the device name is relevant.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#name
   */
  name?: string | null;

  /**
   * List of allowed sensor state value. An empty list is not allowed. The sensor's device_class must be set to enum.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#options
   */
  options?: string[];

  /**
   * Must be sensor. Only allowed and required in MQTT auto discovery device messages.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#platform
   */
  platform?: "sensor";

  /**
   * The maximum QoS level of the state topic.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#qos
   */
  qos?: QOS;

  /**
   * The state_class of the sensor.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#state_class
   */
  state_class?: StateClassesSensor;

  /**
   * The MQTT topic subscribed to receive sensor values.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#state_topic
   */
  state_topic: string;

  /**
   * The number of decimals which should be used in the sensor's state after rounding.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#suggested_display_precision
   */
  suggested_display_precision?: Integer;

  /**
   * Defines the units of measurement of the sensor, if any.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#unit_of_measurement
   */
  unit_of_measurement?: string;

  /**
   * Defines a template to extract the value.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#value_template
   */
  value_template?: Template;
}

export interface SwitchItem extends BaseItem {
  /**
   * The MQTT topic to publish commands to change the switch state.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * Defines a template to generate the payload to send to command_topic.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#command_template
   */
  command_template?: Template;

  /**
   * Sets the class of the device, changing the device state and icon that is displayed on the frontend.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#device_class
   */
  device_class?: string;

  /**
   * The name of the MQTT switch.
   * https://docs.apexinfosys.in/integrations/switch.mqtt#name
   */
  name?: string;

  /**
   * Flag that defines if switch works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The payload that represents the off state.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#payload_off
   */
  payload_off?: string;

  /**
   * The payload that represents the on state.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#payload_on
   */
  payload_on?: string;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The payload that represents the off state. Used when value that represents off state in the state_topic is different from value that should be sent to the command_topic to turn the device off.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#state_off
   */
  state_off?: string;

  /**
   * The payload that represents the on state. Used when value that represents on state in the state_topic is different from value that should be sent to the command_topic to turn the device on.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#state_on
   */
  state_on?: string;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * Defines a template to extract device's state from the state_topic.
   * https://docs.apexinfosys.in/integrations/switch.mqtt/#value_template
   */
  value_template?: Template;
}

export interface VacuumItem extends BaseItem {
  /**
   * The schema to use. Must be state to select the state schema.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#schema
   */
  schema: "state";

  /**
   * The MQTT topic to publish commands to control the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#command_topic
   */
  command_topic?: string;

  /**
   * List of possible fan speeds for the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#fan_speed_list
   */
  fan_speed_list?: string[];

  /**
   * Defines a template to define the fan speed of the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#fan_speed_template
   */
  fan_speed_template?: Template;

  /**
   * The MQTT topic subscribed to receive fan speed values from the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#fan_speed_topic
   */
  fan_speed_topic?: string;

  /**
   * The name of the MQTT vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt#name
   */
  name?: string;

  /**
   * The payload to send to the command_topic to begin a spot cleaning cycle.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_clean_spot
   */
  payload_clean_spot?: string;

  /**
   * The payload to send to the command_topic to locate the vacuum (typically plays a song).
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_locate
   */
  payload_locate?: string;

  /**
   * The payload to send to the command_topic to pause the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_pause
   */
  payload_pause?: string;

  /**
   * The payload to send to the command_topic to tell the vacuum to return to base.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_return_to_base
   */
  payload_return_to_base?: string;

  /**
   * The payload to send to the command_topic to begin the cleaning cycle.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_start
   */
  payload_start?: string;

  /**
   * The payload to send to the command_topic to stop the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_stop
   */
  payload_stop?: string;

  /**
   * The maximum QoS level of the state topic.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The MQTT topic to publish custom commands to the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#send_command_topic
   */
  send_command_topic?: string;

  /**
   * The MQTT topic to publish commands to control the vacuum’s fan speed.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#set_fan_speed_topic
   */
  set_fan_speed_topic?: string;

  /**
   * The MQTT topic subscribed to receive state messages from the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#state_topic
   */
  state_topic: string;

  /**
   * List of features that the vacuum supports (possible values are start, stop, pause, return_home, battery, status, locate, clean_spot, fan_speed, send_command).
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#supported_features
   */
  supported_features?: string[];
}

export interface VacuumLegacyItem extends BaseItem {
  /**
   * The schema to use. Must be state to select the state schema.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#schema
   */
  schema?: "legacy";

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  battery_level_template?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  battery_level_topic?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  charging_template?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  charging_topic?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  cleaning_template?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  cleaning_topic?: Deprecated;

  /**
   * The MQTT topic to publish commands to control the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#command_topic
   */
  command_topic?: string;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  docked_template?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  docked_topic?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  error_template?: Deprecated;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  error_topic?: Deprecated;

  /**
   * List of possible fan speeds for the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#fan_speed_list
   */
  fan_speed_list?: string[];

  /**
   * Defines a template to define the fan speed of the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#fan_speed_template
   */
  fan_speed_template?: Template;

  /**
   * The MQTT topic subscribed to receive fan speed values from the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#fan_speed_topic
   */
  fan_speed_topic?: string;

  /**
   * The name of the MQTT vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt#name
   */
  name?: string;

  /**
   * The payload to send to the command_topic to begin a spot cleaning cycle.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_clean_spot
   */
  payload_clean_spot?: string;

  /**
   * The payload to send to the command_topic to locate the vacuum (typically plays a song).
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_locate
   */
  payload_locate?: string;

  /**
   * The payload to send to the command_topic to tell the vacuum to return to base.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_return_to_base
   */
  payload_return_to_base?: string;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  payload_start_pause?: Deprecated;

  /**
   * The payload to send to the command_topic to stop the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#payload_stop
   */
  payload_stop?: string;

  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  payload_turn_on?: Deprecated;
  /**
   * DEPRECATED
   * This option is part of the deprecated legacy MQTT vacuum schema.
   * New installations should use the state schema as legacy is deprecated and might be removed someday in the future.
   */
  payload_turn_off?: Deprecated;

  /**
   * The maximum QoS level of the state topic.
   * https://docs.apexinfosys.in/integrations/sensor.mqtt#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The MQTT topic to publish custom commands to the vacuum.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#send_command_topic
   */
  send_command_topic?: string;

  /**
   * The MQTT topic to publish commands to control the vacuum’s fan speed.
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#set_fan_speed_topic
   */
  set_fan_speed_topic?: string;

  /**
   * List of features that the vacuum supports (possible values are start, stop, pause, return_home, battery, status, locate, clean_spot, fan_speed, send_command).
   * https://docs.apexinfosys.in/integrations/vacuum.mqtt/#supported_features
   */
  supported_features?: string[];
}

export interface SirenItem extends BaseItem {
  /**
   * The list of available tones the siren supports.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#available_tones
   */
  available_tones?: string[];

  /**
   * Defines a template to generate a custom payload to send to command_topic.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#command_template
   */
  command_template?: Template;

  /**
   * Defines a template to generate a custom payload to send to command_topic when the siren turn off action is called.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#command_off_template
   */
  command_off_template?: Template;

  /**
   * The MQTT topic to publish commands to change the siren state.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#command_topic
   */
  command_topic: string;

  /**
   * Defines if the siren supports the duration option.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#support_duration
   */
  support_duration?: boolean;

  /**
   * Defines if the siren supports setting the volume.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#support_volume_set
   */
  support_volume_set?: boolean;

  /**
   * The MQTT topic subscribed to receive state updates.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#state_topic
   */
  state_topic?: string;

  /**
   * Defines a template to extract device's state from the state_topic.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#state_value_template
   */
  state_value_template?: Template;

  /**
   * The payload that represents off state. If specified, will be used for both comparing to the value in the state_topic and sending as off command to the command_topic.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#payload_off
   */
  payload_off?: string;

  /**
   * The payload that represents on state. If specified, will be used for both comparing to the value in the state_topic and sending as on command to the command_topic.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#payload_on
   */
  payload_on?: string;

  /**
   * The payload that represents the off state.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#state_off
   */
  state_off?: string;

  /**
   * The payload that represents the on state.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#state_on
   */
  state_on?: string;

  /**
   * Flag that defines if siren works in optimistic mode.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#optimistic
   */
  optimistic?: boolean;

  /**
   * The maximum QoS level to be used when receiving and publishing messages.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#qos
   */
  qos?: QOS;

  /**
   * If the published message should have the retain flag on or not.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#retain
   */
  retain?: boolean;

  /**
   * The name of the siren.
   * https://docs.apexinfosys.in/integrations/siren.mqtt/#name
   */
  name?: string;
}
