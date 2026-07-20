/**
 * Sensor integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/alarm_control_panel/__init__.py
 */
import { IncludeList } from "../../types";
import { PlatformSchema } from "../platform";
import { AlarmControlPanelPlatformSchema as TemplatePlatformSchema } from "./template";

export type Domain = "alarm_control_panel";
export type Schema = Item[] | IncludeList;
export type File = Item | Item[];

/**
 * @TJS-additionalProperties true
 */
interface OtherPlatform extends PlatformSchema {
  /**
   * @TJS-pattern ^(?!(template|mqtt)$)\w+$
   */
  platform: string;
}

type Item = TemplatePlatformSchema | OtherPlatform;

export type SupportedFeature =
  | "camera.AlarmControlPanelEntityFeature.ARM_HOME"
  | "camera.AlarmControlPanelEntityFeature.ARM_AWAY"
  | "camera.AlarmControlPanelEntityFeature.ARM_NIGHT"
  | "camera.AlarmControlPanelEntityFeature.TRIGGER"
  | "camera.AlarmControlPanelEntityFeature.ARM_CUSTOM_BYPASS"
  | "camera.AlarmControlPanelEntityFeature.ARM_VACATION";
