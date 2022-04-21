import { useBodyScrollLock, usePrevious } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import {
  MotionProps,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MergeExclusive } from "type-fest";

import {
  belt,
  ComponentStyleProps,
  greedy,
  gutterSpacingX,
  gutterSpacingY,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

const enUsResource = {
  controls: {
    close: "Close",
  },
};

interface ModalContextProps {
  current: string | null;
  setCurrent: Dispatch<SetStateAction<string | null>>;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const ModalController: FC = ({ children }) => {
  const { i18n } = useLocale();
  const [current, setCurrent] = useState<string | null>(null);
  const router = useRouter();

  i18n.addResourceBundle("en-US", "Modal", enUsResource);

  // Close the modal whenever the route changes
  useEffect(() => {
    const handleRouteChangeComplete = () => setCurrent(null);

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () =>
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
  }, [router.events]);

  return (
    <ModalContext.Provider value={{ current, setCurrent }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalController = (id: string) => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error(
      "`useModalController` must be used inside a `ModalController`"
    );
  }

  const open = context.current === id;
  const setIsOpen: Dispatch<SetStateAction<boolean>> = (update) => {
    const next = typeof update === "function" ? update(open) : update;

    // We'll only change the current value if the target modal is being opened
    // or if the target modal is the current modal.
    const shouldChange = next || open;

    if (shouldChange) {
      context.setCurrent(next ? id : null);
    }
  };

  return { current: context.current, open, setIsOpen };
};

export const useModalState = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("`useModalState` must be used inside a `ModalController`");
  }

  return !!context.current;
};

export enum ModalType {
  DRAWER = "DRAWER",
  POPUP = "POPUP",
}

type ModalProps = ComponentStyleProps & {
  onClose: () => void;
  open?: boolean;
  seo?: boolean;
} & MergeExclusive<
    {
      label: string;
    },
    { labelledBy: string }
  > &
  MergeExclusive<
    { alignment: "left" | "right"; type: ModalType.DRAWER },
    { type?: ModalType }
  >;

const Modal: FC<ModalProps> = ({
  _css = {},
  alignment = "left",
  children,
  label,
  labelledBy,
  onClose,
  open,
  seo,
  type = ModalType.DRAWER,
}) => {
  const bodyScroll = useBodyScrollLock<HTMLDivElement>();
  const { t } = useLocale();
  const [isAnimated, setIsAnimated] = useState(false);
  const wasOpen = usePrevious(open);
  const modalRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

  const MAX_OPACITY = 0.5;

  const alignmentModifier =
    type === ModalType.DRAWER ? (alignment === "left" ? -1 : 1) : null;

  const linkedOpacity = useTransform(x, (value: number | string) => {
    if (alignmentModifier === null) {
      return;
    }

    let relativeTransparency = 1;

    if (typeof value === "number") {
      // Pixel-based translation values
      const effectiveValue = value * alignmentModifier;
      const width = modalRef.current && modalRef.current.offsetWidth;

      if (width && !isNaN(value)) {
        relativeTransparency = Math.max(0, Math.min(effectiveValue / width, 1));
      }
    } else if (typeof value === "string" && value.endsWith("%")) {
      // Percentage-based translation values
      const percent = parseFloat(value);

      if (!isNaN(percent)) {
        relativeTransparency = (percent * alignmentModifier) / 100;
      }
    }

    return (1 - relativeTransparency) * MAX_OPACITY;
  });

  let motionAsideAnimationProps: Partial<MotionProps> = {};
  let motionDivAnimationProps: Partial<MotionProps> = {
    animate: controls,
    initial: "close",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
    variants: {
      close: { opacity: 0 },
      open: { opacity: 1 },
    },
  };
  let motionButtonAnimationProps: Partial<MotionProps> = {};

  if (type === ModalType.DRAWER && alignmentModifier) {
    motionAsideAnimationProps = {
      animate: controls,
      initial: "close",
      style: { x },
      transition: {
        damping: 100,
        mass: 0.25,
        stiffness: 1000,
        type: "spring",
      },
      variants: {
        close: { x: `${100 * alignmentModifier}%` },
        open: { x: 0 },
      },
    };
    motionDivAnimationProps = {};
    motionButtonAnimationProps = { style: { opacity: linkedOpacity } };
  }

  // Start the animation and update the `isAnimated` value. We don't need to
  // worry about cleaning any of the state changes as `controls.start` will
  // reject if the animation is interrupted.
  const trigger = useCallback(
    async (target: string) => {
      setIsAnimated(true);

      await controls.start(target);

      setIsAnimated(false);
    },
    [controls, setIsAnimated]
  );

  useEffect(() => {
    // Don't trigger unnecessary animations:
    // 1. It's the first render and the modal is already closed
    // 2. Nothing has changed
    if ((typeof wasOpen === "undefined" && !open) || open === wasOpen) {
      return;
    }

    if (!open) {
      trigger("close");
      return;
    }

    trigger("open");
  }, [open, trigger, wasOpen]);

  useEffect(() => {
    open ? bodyScroll.lock() : bodyScroll.unlock();
  }, [bodyScroll, open, trigger]);

  return (
    /*
     * We can't use `AnimatePresence` as:
     * 1) it prevents prop changes, so we wouldn't be able to disable dragging
     *    during animations, and
     * 2) it will feed its own values into the `useMotionValue` hook which will
     *    interfere with our opacity animation.
     *
     * Instead we'll use a combination of `open` (the current state),
     * `isAnimated` (whether or not the menu is entering/exiting) and `wasOpen`
     * (the previous state, which will handle the case when `open` has just
     * changed but `isAnimated` has not yet been updated).
     */
    open || isAnimated || wasOpen ? (
      <motion.div
        css={s(greedy, {
          pointerEvents: open ? "initial" : "none",
          position: "fixed",
          zIndex: 99999,
        })}
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-modal
        role="dialog"
        {...motionDivAnimationProps}
      >
        <motion.aside
          css={s(
            type === ModalType.DRAWER
              ? {
                  maxWidth: 400,
                }
              : s(belt, (t) => ({
                  borderRadius: t.radius.sm,
                  height: "100%",
                  left: "50%",
                  maxHeight: gutterSpacingY(t).map((spacing) =>
                    typeof spacing === "number"
                      ? `calc(100% - 2 * ${spacing}px)`
                      : null
                  ),
                  maxWidth: gutterSpacingX(t).map((spacing) =>
                    typeof spacing === "number"
                      ? `calc(100% - 2 * ${spacing}px)`
                      : null
                  ),
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100%",
                })),
            (t) => ({
              backgroundColor: t.color.background.base,
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 24px 0px",
            }),
            _css,
            type === ModalType.DRAWER
              ? {
                  [alignment]: 0,
                  bottom: 0,
                  ...size("100%"),
                  top: 0,
                }
              : {},
            { position: "absolute", zIndex: 1 }
          )}
          ref={modalRef}
          {...motionAsideAnimationProps}
        >
          <div
            css={s({
              overflow: "auto",
              ...size("100%"),
            })}
            ref={bodyScroll.ref}
          >
            {children}
          </div>
        </motion.aside>
        <motion.button
          css={s(greedy, (t) => ({
            backgroundColor: t.color.background.dark,
            opacity: type === ModalType.DRAWER ? null : MAX_OPACITY,
            position: "absolute",
          }))}
          onClick={onClose}
          type="button"
          {...motionButtonAnimationProps}
        >
          <span css={s(visuallyHidden)}>{t("Modal:controls.close")}</span>
        </motion.button>
      </motion.div>
    ) : seo ? (
      <div css={s({ display: "none" })}>{children}</div>
    ) : null
  );
};

export default Modal;
