import { captureException } from "@sentry/nextjs";
import { useBodyScrollLock } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import React, {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { MergeExclusive } from "type-fest";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

import cross from "../icons/cross";
import Icon from "./icon";

const enUsResource = {
  close: "Close",
};

interface VideoLauncherRenderProps {
  isActive: boolean;
  isBusy: boolean;
  isPending: boolean;
  isFullscreen: boolean;
}

type VideoLauncherProps = ComponentStyleProps & {
  children: (props: VideoLauncherRenderProps) => ReactNode;
  onClick?: MouseEventHandler;
  preload?: "auto" | "metadata" | "none";
} & MergeExclusive<
    {
      src: string;
    },
    { sources: Record<"src" | "type", string>[] }
  >;

const VideoLauncher = ({
  _css = {},
  children,
  onClick,
  preload = "none",
  src,
  sources,
}: VideoLauncherProps) => {
  const bodyScroll = useBodyScrollLock<HTMLDivElement>();
  const { i18n, t } = useLocale();
  const videoElRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  i18n.addResourceBundle("en-US", "videoLauncher", enUsResource);

  const handleEntrance = async () => {
    if (!videoElRef.current) {
      return;
    }

    setIsPending(true);

    try {
      await videoElRef.current?.play();

      // Only mark the video as active once the play request has succeeded
      setIsActive(true);
      bodyScroll.lock();
    } catch (error) {
      // Capture `NotAllowedErrors`, as the user shouldn't be able to trigger
      // these. We'll ignore all other errors as they're easily caused by
      // network issues
      if (error.name === "NotAllowedError") {
        captureException(error);
      }
    }

    setIsPending(false);
  };

  const handleExit = async () => {
    videoElRef.current?.pause();

    setIsActive(false);
    bodyScroll.unlock();
  };

  // We'll need to make the playback and fullscreen requests synchronously
  // within `handleClick` to ensure iOS views them as interactive events
  const handleClick: MouseEventHandler = async (...args) => {
    if (onClick) {
      onClick(...args);
    }

    handleEntrance();
  };

  const handleKeydown = ({ key }: KeyboardEvent) => {
    if (key === "Escape") {
      handleExit();
    }
  };

  useEffect(() => {
    if (!videoElRef.current) {
      return;
    }

    const handleFullscreen = (event: Event) => {
      let fullscreenEnabled: boolean;

      if (event.type === "webkitbeginfullscreen") {
        fullscreenEnabled = true;
      } else if (event.type === "webkitendfullscreen") {
        fullscreenEnabled = false;
      } else {
        fullscreenEnabled =
          window.document.fullscreenEnabled || // Fullscreen API
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window.document as any).webkitIsFullScreen || // Newer non-standard
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (videoElRef.current as any)?.webkitDisplayingFullscreen; // Older non-standard
      }

      if (!fullscreenEnabled) {
        handleExit();
      }

      setIsFullscreen(fullscreenEnabled);
    };

    const eventTypes = [
      "webkitbeginfullscreen", // iOS
      "webkitendfullscreen", // iOS
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "fullscreenchange",
    ];

    eventTypes.forEach((eventType) =>
      videoElRef.current?.addEventListener(eventType, handleFullscreen)
    );

    return () =>
      eventTypes.forEach((eventType) =>
        videoElRef.current?.removeEventListener(eventType, handleFullscreen)
      );
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isActive]);

  return (
    <>
      <button css={s({ display: "block" }, _css)} onClick={handleClick}>
        {children({
          isActive,
          isBusy: isActive || isPending,
          isFullscreen,
          isPending,
        })}
      </button>
      <div
        ref={bodyScroll.ref}
        css={s({
          ...size("100%"),
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          bottom: 0,
          display: "flex !important", // Override `[hidden]` styles as we're using opacity and visibility instead
          justifyContent: "center",
          left: 0,
          opacity: isActive ? 1 : 0,
          position: "fixed",
          top: 0,
          transitionDelay: isActive ? "0s" : "0s, 500ms", // Delay the change to `visibility: hidden`
          transitionDuration: "500ms, 0s",
          transitionProperty: "opacity, visibility",
          visibility: isActive ? "visible" : "hidden",
          width: "100vw", // Use `vw` instead of percentage to match the body width with `scroll: overlay`
          zIndex: 2147483001, // Position in front of Gorgias launcher
        })}
        hidden={!isActive}
      >
        <video
          ref={videoElRef}
          controls
          css={s({ maxHeight: "100%", maxWidth: "100%" })}
          preload={preload}
          src={src}
        >
          {sources?.map(({ src, type }) => (
            <source key={src} src={src} type={type} />
          ))}
        </video>
        <button
          css={s((t) => ({
            "&:hover": {
              backgroundColor: t.color.background.light,
            },
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            borderRadius: t.radius.sm,
            color: t.color.background.base,
            opacity: isActive && !isFullscreen ? 1 : 0,
            padding: t.spacing.xxs,
            position: "absolute",
            right: t.spacing.sm,
            top: t.spacing.sm,
            transition: "background-color 500ms, opacity 500ms",
            zIndex: 1,
          }))}
          onClick={handleExit}
        >
          <Icon
            _css={s((t) => ({ ...size(t.spacing.lg) }))}
            path={cross}
            title={t("videoLauncher:close")}
          />
        </button>
      </div>
    </>
  );
};

export default VideoLauncher;
