export interface WebOSTvTrigger {
  /**
   * Trigger fires when WebOS integration attempts to turn on the TV.
   * https://docs.apexinfosys.in/integrations/webostv/#configuration
   */
  platform: "webostv.turn_on";

  /**
   * The entity ID of the TV that wants to get turned on.
   * https://docs.apexinfosys.in/integrations/webostv/#configuration
   */
  entity_id?: string;
}
