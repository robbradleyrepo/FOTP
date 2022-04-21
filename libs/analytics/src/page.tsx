import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";

import { dataLayerTrack } from "./datalayer";

const TrackPageEvents = () => {
  const counter = useRef(0);

  const trackPageView = useCallback(() => {
    dataLayerTrack({
      event: "next_route_change_complete",
      spa_route_changes: counter.current++,
    });
  }, []);
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeComplete", trackPageView);

    return () => {
      router.events.off("routeChangeComplete", trackPageView);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackPageView]);

  return null;
};

export default TrackPageEvents;
