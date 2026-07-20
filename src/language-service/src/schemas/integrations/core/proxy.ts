/**
 * Camera Proxy integration
 * Source: https://github.com/apexos/core/blob/dev/apexos/components/proxy/camera.py
 */
import { CameraEntity, IncludeList, Integer, PositiveInteger } from "../../types";
import { PlatformSchema } from "../platform";

export type Domain = "proxy";
export type Schema = Item[] | IncludeList;
export type File = Item | Item[];

type Item = ProxyCameraPlatformSchema;

export interface ProxyCameraPlatformSchema extends PlatformSchema {
  /**
   * The proxy camera integration allows you to pass another camera's output through post-processing routines and
   * generate a new camera with the post-processed output.
   * https://docs.apexinfosys.in/integrations/proxy/
   */
  platform: "proxy";

  /**
   * The ID of another ApexOS camera to post-process.
   * https://docs.apexinfosys.in/integrations/proxy/#entity_id
   */
  entity_id: CameraEntity;

  /**
   * This parameter allows you to override the name of your camera.
   * https://docs.apexinfosys.in/integrations/proxy/#name
   */
  name?: string;

  /**
   * The operating mode, either `resize` or `crop`.
   * https://docs.apexinfosys.in/integrations/proxy/#mode
   */
  mode?: "resize" | "crop";

  /**
   * The maximum width of single images taken from the camera (aspect ratio will be
   * maintained on resize processing).
   * https://docs.apexinfosys.in/integrations/proxy/#max_image_width
   */
  max_image_width?: PositiveInteger;

  /**
   * The maximum height of single images taken from the camera, only used for crop
   * operations. If not provided, the original height is assumed by default.
   * https://docs.apexinfosys.in/integrations/proxy/#max_image_height
   */
  max_image_height?: PositiveInteger;

  /**
   * The maximum width of the MJPEG stream from the camera (aspect ratio will be
   * maintained on resize processing).
   * https://docs.apexinfosys.in/integrations/proxy/#max_stream_width
   */
  max_stream_width?: PositiveInteger;

  /**
   * The maximum height of the MJPEG stream from the camera, only used for crop
   * operations. If not provided, the original height is assumed by default.
   * https://docs.apexinfosys.in/integrations/proxy/#max_stream_height
   */
  max_stream_height?: PositiveInteger;

  /**
   * The top (y) coordinate to be used as a starting point for crop operations.
   * https://docs.apexinfosys.in/integrations/proxy/#image_top
   */
  image_top?: Integer;

  /**
   * The left (x) coordinate to be used as a starting point for crop operations.
   * https://docs.apexinfosys.in/integrations/proxy/#image_left
   */
  image_left?: Integer;

  /**
   * The quality level used for resulting JPEG for snapshots.
   * https://docs.apexinfosys.in/integrations/proxy/#image_quality
   */
  image_quality?: PositiveInteger;

  /**
   * The quality level used for resulting MJPEG streams.
   * https://docs.apexinfosys.in/integrations/proxy/#stream_quality
   */
  stream_quality?: PositiveInteger;

  /**
   * The minimum time in seconds between generating successive image snapshots.
   * https://docs.apexinfosys.in/integrations/proxy/#image_refresh_rate
   */
  image_refresh_rate?: PositiveInteger;

  /**
   * Resize the image even if the resulting image would take up more bandwidth than
   * the original.
   * https://docs.apexinfosys.in/integrations/proxy/#force_resize
   */
  force_resize?: boolean;

  /**
   * Preserve the last image and re-send in the case the camera is not responding.
   * https://docs.apexinfosys.in/integrations/proxy/#cache_images
   */
  cache_images?: boolean;
}
