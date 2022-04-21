import { useBodyScrollLock } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import Player, { EventCallback } from "@vimeo/player";
import React, {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

import cross from "../icons/cross";
import Icon from "./icon";

const enUsResource = {
  close: "Close",
};

interface VimeoLauncherRenderProps {
  isActive: boolean;
  isBusy: boolean;
  isPending: boolean;
  isFullscreen: boolean;
}

interface VimeoLauncherProps extends ComponentStyleProps {
  children: (props: VimeoLauncherRenderProps) => ReactNode;
  id: number;
  onClick?: MouseEventHandler;
}

const VimeoLauncher = ({
  _css = {},
  children,
  id,
  onClick,
}: VimeoLauncherProps) => {
  const bodyScroll = useBodyScrollLock<HTMLDivElement>();
  const { i18n, t } = useLocale();
  const playerRef = useRef<Player>();
  const wrapperElRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  i18n.addResourceBundle("en-US", "vimeoLauncher", enUsResource);

  const handleEntrance = async () => {
    setIsPending(true);

    try {
      await playerRef.current?.play();

      // Only mark the video as active once the play request has succeeded
      setIsActive(true);
      bodyScroll.lock();
    } catch (error) {
      // Fail silently
    }

    setIsPending(false);
  };

  const handleExit = async () => {
    try {
      await playerRef.current?.pause();

      // Only mark the video as inactive once the pause request has succeeded
      setIsActive(false);
      bodyScroll.unlock();
    } catch (error) {
      // Fail silently
    }
  };

  // We'll need to make the playback and fullscreen requests synchronously
  // within `handleClick` to ensure iOS views them as interactive events
  const handleClick: MouseEventHandler = async (...args) => {
    if (onClick) {
      onClick(...args);
    }

    handleEntrance();
  };

  const handleKeydown = ({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27) {
      handleExit();
    }
  };

  useEffect(() => {
    if (!wrapperElRef.current) {
      return;
    }

    playerRef.current = new Player(wrapperElRef.current, {
      id,
      playsinline: false,
    });

    return () => {
      playerRef.current?.destroy();
    };
  }, [id]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const handleFullscreen: EventCallback = ({ fullscreen }) => {
      if (!fullscreen) {
        handleExit();
      }

      setIsFullscreen(fullscreen);
    };

    playerRef.current.on("fullscreenchange", handleFullscreen);

    return () => playerRef.current?.off("fullscreenchange", handleFullscreen);
  }, [id]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isActive]);

  return (
    <>
      <button css={s(_css)} onClick={handleClick}>
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
          zIndex: 99999,
        })}
        hidden={!isActive}
      >
        <div
          ref={wrapperElRef}
          css={s({ ...size("100%"), "& > iframe": size("100%") })}
        />
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
            title={t("vimeoLauncher:close")}
          />
        </button>
      </div>
    </>
  );
};

export default VimeoLauncher;
