import { Entity, IncludeList } from "../types";
import { Badge, Card } from "./types";

type Badges = Badge | Entity;

export type View = MasonryView | PanelView | SidebarView | CustomView;

interface BaseView {
  /**
   * Style the background using CSS.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#background
   */
  background?: string;

  /**
   * List of entities IDs or badge objects to display as badges. Note that badges do not show when view is in panel mode.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#badges
   */
  badges?: Badges[];

  /**
   * Cards to display in this view.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#cards
   */
  cards?: Card[] | IncludeList;

  /**
   * Icon-name from Material Design Icons.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#icon
   */
  icon?: string;

  /**
   * You can link to one view from a card in another view when using cards that support navigation (navigation_path). The string supplied here will be appended to the string /lovelace/ to create the path to the view.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#path
   */
  path?: string;

  /**
   * Set a separate theme for the view and its cards.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#theme
   */
  theme?: string;

  /**
   * The title or name.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#title
   */
  title: string;

  /**
   * You can specify the visibility of views as a whole or per-user. (Note: This is only for the display of the tabs. The URL path is still accessible.)
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#visible
   */
  visible?: boolean | any;
}

export interface MasonryView extends BaseView {
  /**
   * The masonry view is the default view type. It sorts cards in columns based on their size.
   * https://docs.apexinfosys.in/lovelace/masonry/
   */
  type?: "masonry";

  /**
   * List of entities IDs or badge objects to display as badges. Note that badges do not show when view is in panel mode.
   * https://docs.apexinfosys.in/lovelace/dashboards-and-views/#badges
   */
  badges?: Badges[];
}

export interface PanelView extends BaseView {
  /**
   * In this view the first card is rendered full-width, other cards in the view will not be rendered.
   * https://docs.apexinfosys.in/lovelace/panel/
   */
  type: "panel";
}

export interface SidebarView extends BaseView {
  /**
   * The sidebar view has 2 columns, a wide one and a smaller one on the right.
   * https://rc.docs.apexinfosys.in/lovelace/sidebar/
   */
  type: "sidebar";
}

/**
 * @TJS-additionalProperties true
 */
export interface CustomView extends BaseView {
  /**
   * @TJS-pattern custom:(.*)$
   */
  type: string;
}
