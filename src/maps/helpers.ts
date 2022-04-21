import { LatLng } from "@sss/prismic";

import { color } from "../ui/styles/variables";

const getOverlay = ([...markers]: LatLng[]) =>
  encodeURIComponent(
    markers
      .sort((a, b) => b.latitude - a.latitude) // Sort by latitude, so southern flags sit in front of northern ones
      .map(
        ({ latitude, longitude }) =>
          `pin-s+${color.background.dark.replace(
            "#",
            ""
          )}(${longitude},${latitude})`
      )
      .join(",")
  )
    // Encode parentheses otherwise it will break Styled Components when used
    // as a responsive background image
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");

export interface GetMapUrlArguments extends LatLng {
  height: number;
  markers: LatLng[];
  styleId?: string;
  username?: string;
  width: number;
  zoom: number;
}

// See https://docs.mapbox.com/api/maps/#static
export const getMapUrl = ({
  height,
  latitude,
  longitude,
  markers,
  styleId = process.env.MAPBOX_STYLE_ID,
  username = process.env.MAPBOX_USERNAME,
  width,
  zoom,
}: GetMapUrlArguments) =>
  `https://api.mapbox.com/styles/v1/${username}/${styleId}${
    process.env.NODE_ENV === "production" ? "" : "/draft"
  }/static/${getOverlay(
    markers
  )}/${longitude},${latitude},${zoom}/${width}x${height}@2x?access_token=${
    process.env.MAPBOX_KEY
  }`;
