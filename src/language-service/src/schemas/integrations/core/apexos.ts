import { ConfigurationRoot } from "../../configuration";

import {
  Currency,
  CountryTags,
  DeviceClasses,
  IncludeNamed,
  Integer,
  LanguageTags,
  TimeZone,
  UnitSystem,
} from "../../types";

export type Domain = "group";
export interface Schema {
  auth_mfa_modules?: any[] | IncludeNamed; // TODO: Extract similar as in integrations
  auth_providers?: AuthProviders[] | IncludeNamed; // TODO: Extract similar as in integrations

  /**
   * List of folders that can be used as sources for files.
   * https://docs.apexinfosys.in/docs/configuration/basic/#allowlist_external_dirs
   */
  allowlist_external_dirs?: string[];

  /**
   * List of URLs that can be used as sources for files.
   * https://docs.apexinfosys.in/docs/configuration/basic/#allowlist_external_urls
   */
  allowlist_external_urls?: string[];

  /**
   * Country in which ApexOS is running. This may, for example, influence radio settings to comply with local regulations. The country should be specified as an ISO 3166.1 alpha-2 code. Pick your country from the column Code of Wikipedia’s list of ISO 31661 alpha-2 officially assigned code codes.
   * https://docs.apexinfosys.in/docs/configuration/basic/#country
   */
  country?: CountryTags;

  /**
   * Set the default currency for ApexOS to use.
   * https://docs.apexinfosys.in/docs/configuration/basic/#currency
   */
  currency?: Currency;

  /**
   * Customize entities.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/
   */
  customize?: CoreCustomize | IncludeNamed;

  /**
   * Customize all entities of a given domain.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/
   */
  customize_domain?: CoreCustomize | IncludeNamed;

  /**
   * Customize entities matching a pattern.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/
   */
  customize_glob?: CoreCustomize | IncludeNamed;

  /**
   * Altitude above sea level in meters. Impacts weather/sunrise data.
   * https://docs.apexinfosys.in/docs/configuration/basic/#elevation
   */
  elevation?: Integer;

  /**
   * The URL that ApexOS is available on from the internet. For example: https://example.duckdns.org:1702. Note that this setting may only contain a protocol, hostname and port; using a path is not supported.
   * https://docs.apexinfosys.in/docs/configuration/basic/#external_url
   */
  external_url?: string;

  /**
   * The URL that ApexOS is available on from your local network. For example: http://apexos.local:1702. Note that this setting may only contain a protocol, hostname and port; using a path is not supported.
   * https://docs.apexinfosys.in/docs/configuration/basic/#internal_url
   */
  internal_url?: string;

  /**
   * Default language used by ApexOS. This may, for example, influence the language used by voice assistants. The language should be specified as an RFC 5646 language tag, and must be a language which ApexOS is translated to.
   * https://docs.apexinfosys.in/docs/configuration/basic/#language
   */
  language?: LanguageTags;

  /**
   * Latitude of your location required to calculate the time the sun rises and sets.
   * https://docs.apexinfosys.in/docs/configuration/basic/#latitude
   *
   * @minimum -90
   * @maximum 90
   */
  latitude?: number;

  /**
   * Enable this option to restore pre-0.117 template rendering. Which renders all templates to string, instead of native types.
   * https://docs.apexinfosys.in/docs/configuration/basic/#legacy_templates
   */
  legacy_templates?: boolean;

  /**
   * Longitude of your location required to calculate the time the sun rises and sets.
   * https://docs.apexinfosys.in/docs/configuration/basic/#longitude
   *
   * @minimum -180
   * @maximum 180
   */
  longitude?: number;

  /**
   * A mapping of local media sources and their paths on disk.
   * https://docs.apexinfosys.in/docs/configuration/basic/#media_dirs
   */
  media_dirs?: { [key: string]: string };

  /**
   * Name of the location where ApexOS is running.
   * https://docs.apexinfosys.in/docs/configuration/basic/#name
   */
  name?: string;

  /**
   * Packages in ApexOS provide a way to bundle different component’s configuration together. It allows for "splitting" your configuration.
   * https://docs.apexinfosys.in/docs/configuration/packages/
   */
  packages?: ConfigurationRoot | IncludeNamed;

  /**
   * Pick your time zone from the column TZ of Wikipedia’s list of tz database time
   * https://docs.apexinfosys.in/docs/configuration/basic/#time_zone
   * https://www.wikiwand.com/en/List_of_tz_database_time_zones
   */
  time_zone?: TimeZone;

  /**
   * "metric" for Metric, "imperial" for Imperial.
   * This also sets temperature unit ApexOS will use.
   * https://docs.apexinfosys.in/docs/configuration/basic/#unit_system
   */
  unit_system?: UnitSystem;

  /**
   * Override temperature unit set by unit_system.
   * "C" for Celsius, "F" for Fahrenheit.
   * https://docs.apexinfosys.in/docs/configuration/basic/#temperature_unit
   */
  temperature_unit?: "C" | "F";
}

interface CoreCustomize {
  [key: string]: CoreCustomizeItem | IncludeNamed;
}

/**
 * @TJS-additionalProperties true
 */
interface CoreCustomizeItem {
  /**
   * For switches with an assumed state two buttons are shown (turn off, turn on) instead of a switch.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/#assumed_state
   */
  assumed_state?: boolean;

  /**
   * Sets the class of the device, changing the device state and icon that is displayed on the UI (see below).
   * Please note: It does not set the unit_of_measurement.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/#device_class
   */
  device_class?: DeviceClasses;

  /**
   * URL to use as picture for entity.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/#entity_picture
   */
  entity_picture?: string;

  /**
   * Name of the entity as displayed in the UI.
   * Please note that most of the time you can just rename the entity in the UI itself.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/#friendly_name
   */
  friendly_name?: string;

  /**
   * Any icon from MaterialDesignIcons.com. Prefix name with mdi:. For example: mdi:home.
   * Please note that most of the time you can just change the entity icon in the UI itself.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/#icon
   */
  icon?: string;

  /**
   * Sets the initial state for automations, on (true) or off (false).
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/#initial_state
   */
  initial_state?: boolean;

  /**
   * Defines the units of measurement, if any. This will also influence the graphical presentation in the history visualization as continuous value. Sensors with missing unit_of_measurement are showing as discrete values.
   * https://docs.apexinfosys.in/docs/configuration/customizing-devices/#unit_of_measurement
   */
  unit_of_measurement?: string;
}

/**
 * TODO: Definitions below need to be extracted in a similar fashion as integrations.
 */
type AuthProviders =
  | ApexOSAuthProvider
  | TrustedNetworksAuthProvider
  | CommandLineAuthProvider
  | LegacyApiPasswordAuthProvider;

interface ApexOSAuthProvider {
  type: "apexos";
}

interface TrustedNetworksAuthProvider {
  type: "trusted_networks";
  trusted_networks: string | string[] | any[];
  trusted_users?: {
    [key: string]: string | (string | { [key: string]: string })[];
  };
  allow_bypass_login?: boolean;
}

interface CommandLineAuthProvider {
  type: "command_line";
  command: string;
  args?: any;
  meta?: boolean;
}

interface LegacyApiPasswordAuthProvider {
  type: "legacy_api_password";
  api_password: string;
}
