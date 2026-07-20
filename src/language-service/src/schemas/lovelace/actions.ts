/**
 * Lovelace Actions
 * Source: https://github.com/apexos/frontend/blob/dev/src/data/lovelace.ts
 */
import {
  Area,
  Entities,
  Entity,
  Floor,
  Include,
  Label,
  LegacySyntax,
} from "../types";

export type Action =
  | CallServiceAction
  | CustomAction
  | Include
  | MoreInfoAction
  | NavigateAction
  | NoneAction
  | PerformActionAction
  | ToggleAction
  | URLAction;

interface CallServiceAction {
  /**
   * Legacy syntax. Use "perform-action" instead.
   * https://docs.apexinfosys.in/lovelace/actions/
   */
  action: "call-service";

  /**
   * Legacy syntax. Use "perform_action" instead.
   * https://docs.apexinfosys.in/lovelace/actions/#perform_action
   */
  service?: LegacySyntax;
}

interface PerformActionAction {
  /**
   * Perform an ApexOS action.
   * https://docs.apexinfosys.in/lovelace/actions/
   */
  action: "perform-action";

  /**
   * Legacy syntax. Use "perform_action" instead.
   * https://docs.apexinfosys.in/lovelace/actions/#service
   */
  service?: LegacySyntax;

  /**
   * Action to perform (e.g., media_player.media_play_pause)
   * https://docs.apexinfosys.in/lovelace/actions/#perform_action
   */
  perform_action?: string;

  /**
   * Legacy syntax. Use "data" instead.
   * https://docs.apexinfosys.in/lovelace/actions/#data
   */
  service_data?: LegacySyntax;

  /**
   * Service data to include (e.g., entity_id: media_player.bedroom).
   * https://docs.apexinfosys.in/lovelace/actions/#data
   */
  data?: ServiceData;

  /**
   * Present a confirmation dialog to confirm the action. See confirmation object below
   * https://docs.apexinfosys.in/lovelace/actions/#confirmation
   */
  confirmation?: Confirmation | boolean;

  /**
   * Defines the target (area(s), device(s) and entitie(s)) to perform this action on.
   * https://docs.apexinfosys.in/lovelace/actions/#target
   */
  target?: {
    /**
     * The entity (or entities) to perform this action on.
     * https://docs.apexinfosys.in/docs/scripts/perform-actions/
     */
    entity_id?: Entities | "all" | "none" | null;

    /**
     * The device (or devices) to perform this action on.
     * https://docs.apexinfosys.in/docs/scripts/perform-actions/
     */
    device_id?: string | string[] | "none";

    /**
     * The area (or areas) to perform this action on.
     * https://docs.apexinfosys.in/docs/scripts/perform-actions/
     */
    area_id?: Area | Area[] | "none";

    /**
     * The floor (or floors) to execute this service call on.
     * https://docs.apexinfosys.in/docs/scripts/perform-actions/
     */
    floor_id?: Floor | Floor[] | "none";

    /**
     * The labels (or labels) to execute this service call on.
     * https://docs.apexinfosys.in/docs/scripts/perform-actions/
     */
    label_id?: Label | Label[] | "none";
  };
}

interface ServiceData {
  /**
   * Entity ID to target this service call at.
   * https://docs.apexinfosys.in/lovelace/actions/#service_data
   */
  entity_id?: Entity | Entity[];
  [key: string]: any;
}

/**
 * @TJS-additionalProperties true
 */
interface CustomAction {
  action: "fire-dom-event";

  /**
   * Present a confirmation dialog to confirm the action. See confirmation object below
   * https://docs.apexinfosys.in/lovelace/actions/#confirmation
   */
  confirmation?: Confirmation;
}

interface MoreInfoAction {
  /**
   * Action to trigger the more info dialog of this entity.
   * https://docs.apexinfosys.in/lovelace/actions/
   */
  action: "more-info";

  /**
   * Present a confirmation dialog to confirm the action. See confirmation object below
   * https://docs.apexinfosys.in/lovelace/actions/#confirmation
   */
  confirmation?: Confirmation;
}

interface NavigateAction {
  /**
   * Action to navigate to an another view.
   * https://docs.apexinfosys.in/lovelace/actions/
   */
  action: "navigate";

  /**
   * Path to navigate to (e.g., /lovelace/0/) when action defined as navigate
   * https://docs.apexinfosys.in/lovelace/actions/#navigation_path
   */
  navigation_path: string;

  /**
   * Present a confirmation dialog to confirm the action. See confirmation object below
   * https://docs.apexinfosys.in/lovelace/actions/#confirmation
   */
  confirmation?: Confirmation;
}

interface NoneAction {
  /**
   * Action to do nothing.
   * https://docs.apexinfosys.in/lovelace/actions/
   */
  action: "none";

  /**
   * Present a confirmation dialog to confirm the action. See confirmation object below
   * https://docs.apexinfosys.in/lovelace/actions/#confirmation
   */
  confirmation?: Confirmation;
}

interface ToggleAction {
  /**
   * Action to toggle the entity state.
   * https://docs.apexinfosys.in/lovelace/actions/
   */
  action: "toggle";

  /**
   * Present a confirmation dialog to confirm the action. See confirmation object below
   * https://docs.apexinfosys.in/lovelace/actions/#confirmation
   */
  confirmation?: Confirmation;
}

interface URLAction {
  /**
   * Action to navigate to an another URL.
   * https://docs.apexinfosys.in/lovelace/actions/
   */
  action: "url";

  /**
   * Path to navigate to (e.g., /lovelace/0/) when action defined as navigate
   * https://docs.apexinfosys.in/lovelace/actions/#url_path
   */
  url_path: string;

  /**
   * Present a confirmation dialog to confirm the action. See confirmation object below
   * https://docs.apexinfosys.in/lovelace/actions/#confirmation
   */
  confirmation?: Confirmation;
}

interface Confirmation {
  /**
   * List of exemption objects.
   * https://docs.apexinfosys.in/lovelace/actions/#exemptions
   */
  exemptions?: Exemption[];

  /**
   * Text to present in the confirmation dialog.
   * https://docs.apexinfosys.in/lovelace/actions/#text
   */
  text?: string;
}

type Exemption = UserExemption;

interface UserExemption {
  /**
   * User id that can see the view tab. For each user´s id listed, the confirmation dialog will NOT be shown.
   * https://docs.apexinfosys.in/lovelace/actions/#user
   */
  user: string;
}
