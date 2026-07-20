/**
 * Intent script integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/intent_script/__init__.py
 */
import { IncludeNamed, Template } from "../../types";
import { Action } from "../actions";

export type Domain = "intent_script";
export interface Schema {
  [key: string]: Item | IncludeNamed | null;
}
export type File = Schema | Item;

interface Item {
  /**
   * Defines an action to run to intents.
   * https://docs.apexinfosys.in/integrations/intent_script/#action
   */
  action?: Action | Action[];

  /**
   * Set to True to have ApexOS not wait for the script to finish before returning the intent response.
   * https://docs.apexinfosys.in/integrations/intent_script/#async_action
   */
  async_action?: boolean;

  /**
   * Card to display.
   * https://docs.apexinfosys.in/integrations/intent_script/#card
   */
  card?: {
    /**
     * Type of card to display. Defaults to "simple".
     * https://docs.apexinfosys.in/integrations/intent_script/#type
     */
    type?: string;

    /**
     * Title of the card to display.
     * https://docs.apexinfosys.in/integrations/intent_script/#title
     */
    title: Template;

    /**
     * Contents of the card to display.
     * https://docs.apexinfosys.in/integrations/intent_script/#content
     */
    content: Template;
  };

  /**
   * Description of the intent.
   * https://docs.apexinfosys.in/integrations/intent_script/#description
   */
  description?: string;

  /**
   * The script mode in which to run the intent script.
   * https://docs.apexinfosys.in/integrations/intent_script/#mode
   */
  mode?: "single" | "restart" | "queued" | "parallel";

  /**
   * List of domains that the entity supports.
   * https://docs.apexinfosys.in/integrations/intent_script/#platforms
   */
  platforms?: string[];

  /**
   * Text or template to return if the user does not respond.
   * https://docs.apexinfosys.in/integrations/intent_script/#reprompt
   */
  reprompt?: {
    /**
     * Type of speech. Defaults to "plain".
     * https://docs.apexinfosys.in/integrations/intent_script/#type
     */
    type?: string;

    /**
     * Text to speech for reprompt.
     * https://docs.apexinfosys.in/integrations/intent_script/#text
     */
    text: Template;
  };

  /**
   * Text or template to return.
   * https://docs.apexinfosys.in/integrations/intent_script/#speech
   */
  speech?: {
    /**
     * Type of speech. Defaults to "plain".
     * https://docs.apexinfosys.in/integrations/intent_script/#type
     */
    type?: string;

    /**
     * Text to speech
     * https://docs.apexinfosys.in/integrations/intent_script/#content
     */
    text: Template;
  };
}
