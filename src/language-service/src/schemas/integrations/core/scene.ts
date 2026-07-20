/**
 * Scene integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/scene/__init__.py
 */
import { IncludeNamed, IncludeList, Deprecated, State } from "../../types";

export type Domain = "scene";
export type Schema = Item[] | IncludeList;
export type File = Item | Item[];

interface Item {
  /**
   * Entities to control and their desired state.
   * https://docs.apexinfosys.in/integrations/scene#entities
   */
  entities:
    | {
      [entity: string]: ItemEntity | State;
    }
    | IncludeNamed;

  /**
   * The icon that shows in the frontend.
   * https://docs.apexinfosys.in/integrations/scene#icon
   */
  icon?: string;

  /**
   * A unique identifier for this automation.
   * Do not use the same twice, ever!
   * https://docs.apexinfosys.in/integrations/scene
   */
  id?: string;

  /**
   * Friendly name of scene.
   * https://docs.apexinfosys.in/integrations/scene#name
   */
  name: string;

  /**
   * Additional data for merely for use with the frontend. Has no functional effect.
   */
  metadata?: any;
}

/**
 * @TJS-additionalProperties true
 */
export interface ItemEntity {
  state?: string;
  /**
   * @TSJ-type integer
   * @minimum 0
   * @maximum 255
   */
  brightness?: number | string;
  source?: string;
  /**
   * @minimum 1
   */
  color_temp?: number | string;
  xy_color?: any;

  /**
   * DEPRECATED.
   *
   * Using transitions on scene using this property is no longer supported.
   * Alternative: https://docs.apexinfosys.in/docs/scene/#using-scene-transitions
   */
  transition?: Deprecated;
}
