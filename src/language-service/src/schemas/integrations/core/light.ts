/**
 * Light integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/light/__init__.py
 */
import { IncludeList } from "../../types";
import { PlatformSchema } from "../platform";
import { LightPlatformSchema as GroupPlatformSchema } from "./group";
import { LightPlatformSchema as TemplatePlatformSchema } from "./template";

export type Domain = "light";
export type Schema = Item[] | IncludeList;
export type File = Item | Item[];

/**
 * @TJS-additionalProperties true
 */
interface OtherPlatform extends PlatformSchema {
  /**
   * @TJS-pattern ^(?!(group|template|mqtt)$)\w+$
   */
  platform: string;
}

type Item = GroupPlatformSchema | TemplatePlatformSchema | OtherPlatform;
