import { useInView } from "@sss/hooks";
import React, { FC, useCallback, useEffect, useRef } from "react";

import { ComponentStyleProps, greedy, s } from "@/common/ui/utils";

import { useMedia } from "../../styles/helpers/mq";

interface VideoBackgroundProps extends ComponentStyleProps {
  poster?: string;
  urls: (string | null)[];
}

const VideoBackground: FC<VideoBackgroundProps> = ({
  _css = {},
  poster,
  urls,
}) => {
  const src = useMedia(urls);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const [ref, inView] = useInView({ rootMargin: "50%" });

  const callbackRef = useCallback(
    (instance: HTMLVideoElement | null) => {
      videoElRef.current = instance;
      ref?.(instance);
    },
    [ref]
  );

  const play = async () => {
    try {
      await videoElRef.current?.play();
    } catch (error) {
      // Fail silently
    }
  };

  // Set the video's `src` within `useEffect` so that:
  // 1) the client and server renders always match, and
  // 2) we don't load more than one video
  useEffect(() => {
    const load = async () => {
      if (!src || !videoElRef.current || !!videoElRef.current.src) {
        return;
      }

      try {
        videoElRef.current.src = src;
        await videoElRef.current.load();

        if (inView) {
          play();
        }
      } catch (error) {
        // Fail silently
      }
    };

    load();
  }, [inView, src]);

  useEffect(() => {
    if (!videoElRef.current?.src) {
      return;
    }

    inView ? play() : videoElRef.current?.pause();
  }, [inView]);

  return (
    <video
      ref={callbackRef}
      css={s(greedy, { objectFit: "cover", zIndex: -1 }, _css)}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
    />
  );
};

export default VideoBackground;
