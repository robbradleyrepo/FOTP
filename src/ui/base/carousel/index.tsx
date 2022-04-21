import { useLocale } from "@sss/i18n";
import React, {
  ComponentType,
  createContext,
  Dispatch,
  FC,
  MouseEventHandler,
  ReactNodeArray,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGesture } from "react-use-gesture";
import styler, { Styler } from "stylefire";

import {
  belt,
  ComponentStyleProps,
  mx,
  negate,
  ResponsiveCSSValue,
  s,
  size,
  useTheme,
  visuallyHidden,
} from "@/common/ui/utils";

import chevronLeft from "../../icons/chevronLeft";
import chevronRight from "../../icons/chevronRight";
import { useMedia } from "../../styles/helpers/mq";
import { ThemeEnhanced } from "../../styles/theme";
import Icon from "../icon";

const enUsResource = {
  controls: {
    dot: "Slide {{ number }} of {{ total }}",
    next: "Next",
    previous: "Previous",
  },
};

type StyleValueFn = (theme: ThemeEnhanced) => ResponsiveCSSValue;

const useThemedCSSValue = () => {
  const theme = useTheme();

  return (value: ResponsiveCSSValue | StyleValueFn): ResponsiveCSSValue =>
    typeof value === "function" ? value(theme) : value;
};

export interface ControlProps {
  active?: boolean;
  onClick: MouseEventHandler;
  title: string;
}

export type Control = ComponentType<ControlProps>;

export interface DotControlProps extends ControlProps {
  index: number;
  selected?: boolean;
}

export type DotControl = ComponentType<DotControlProps>;

export interface Controls {
  Dot: DotControl | null;
  DotContainer: ComponentType | null;
  Next: Control | null;
  Prev: Control | null;
}

export const Dot: DotControl = ({ active, onClick, selected, title }) => (
  <button
    css={s((t) => ({
      backgroundColor: selected ? "currentColor" : "transparent",
      borderColor: "currentColor",
      borderRadius: t.spacing.xxl,
      borderStyle: "solid",
      borderWidth: 1,
      left: "100%",
      ...mx(t.spacing.xs),
      opacity: active ? 1 : 0,
      ...size(10),
      transition: "background 300ms, opacity 300ms",
    }))}
    disabled={!active}
    onClick={onClick}
  >
    <span css={s(visuallyHidden)}>{title}</span>
  </button>
);

const DotContainer: FC = ({ children }) => (
  <div
    css={s({
      display: ["block", null, "none"],
      textAlign: "center",
    })}
  >
    {children}
  </div>
);

const controlStyle = (active: boolean | undefined) =>
  s({
    display: ["none", null, "block"],
    opacity: active ? 1 : 0,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    transition: "opacity 300ms",
  });

export const Next: Control = ({ active, onClick, title }) => (
  <button
    css={s(controlStyle(active), (t) => ({
      left: "100%",
      marginLeft: [0, null, null, t.spacing.sm, t.spacing.md],
    }))}
    disabled={!active}
    onClick={onClick}
  >
    <Icon _css={s(size(24))} path={chevronRight} title={title} />
  </button>
);

export const Prev: Control = ({ active, onClick, title }) => (
  <button
    css={s(controlStyle(active), (t) => ({
      marginRight: [0, null, null, t.spacing.sm, t.spacing.md],
      right: "100%",
    }))}
    disabled={!active}
    onClick={onClick}
  >
    <Icon _css={s(size(24))} path={chevronLeft} title={title} />
  </button>
);

interface ResponsiveConfig extends Array<number | null> {
  0: number;
}

interface CarouselContextProps {
  currentIndex: number;
  currentShowCount: number;
  isReady: boolean;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  showCounts: ResponsiveConfig;
  slideCount: number;
  slides: ReactNodeArray;
  transitionTime: number;
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

interface CarouselControllerProps {
  slides: ReactNodeArray;
  slidesToShow?: number | ResponsiveConfig;
  transitionTime?: number;
}

export const CarouselController: FC<CarouselControllerProps> = ({
  children,
  slides,
  slidesToShow = 1,
  transitionTime = 500,
}) => {
  const { i18n } = useLocale();

  i18n.addResourceBundle("en-US", "carousel", enUsResource);

  const showCounts: ResponsiveConfig = Array.isArray(slidesToShow)
    ? slidesToShow
    : [slidesToShow];
  const slideCount = slides.length;

  const [isReady, setIsReady] = useState(false); // TODO: move this into an external provider that runs at the app level to avoid re-rendering when it's not the initial render
  const [unboundCurrentIndex, setCurrentIndex] = useState(0);
  const currentShowCount = useMedia(showCounts) || showCounts[0];

  // Set the `currentIndex` to make sure it's wrapped within bounds.
  // Even though this uses the responsive `currentShowCount` value, it won't
  // affect SSR, as `currentIndex` will always be zero on the server
  const currentIndex = Math.max(
    0,
    Math.min(unboundCurrentIndex, slideCount - currentShowCount)
  );

  useEffect(() => {
    // Mark `isReady` as true so we can make client-only updates
    setIsReady(true);
  }, []);

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        currentShowCount,
        isReady,
        setCurrentIndex,
        showCounts,
        slideCount: slides.length,
        slides,
        transitionTime,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarouselController = () => {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("`useCarouselController` must be used inside a `Carousel`");
  }

  return context;
};

interface CarouselSlidesProps extends ComponentStyleProps {
  gutter?: ResponsiveCSSValue | StyleValueFn;
  transitionTime?: number;
}

export const CarouselSlides: FC<CarouselSlidesProps> = ({
  _css = {},
  gutter: _gutter,
  transitionTime = 300,
}) => {
  const {
    currentIndex,
    currentShowCount,
    setCurrentIndex,
    showCounts,
    slideCount,
    slides,
  } = useCarouselController();

  const isDragRef = useRef(false);
  const stylerRef = useRef<Styler>();
  const containerElRef = useRef<HTMLDivElement>(null);
  const targetElRef = useRef<HTMLDivElement>(null);
  const trackElRef = useRef<HTMLUListElement>(null);
  const themedCSSValue = useThemedCSSValue();

  const gutter = themedCSSValue(_gutter);

  const bind = useGesture(
    {
      onClick: (event) => {
        if (event.cancelable && isDragRef.current) {
          event.preventDefault();
        }
      },
      onDrag: ({
        cancel,
        direction: [dirX, dirY],
        event,
        first,
        last,
        movement: [deltaX],
        vxvy: [vx],
      }) => {
        if (first) {
          // Reset the values here, as this event will always fire, whereas
          // `onClick` will only fire with mouse events where the gesture
          // finishes over the target
          isDragRef.current = false;
        }

        // Detect the drag direction as soon as we can. If it's horizontal we'll
        // mark it as such and keep going; if not, we'll cancel the event.
        if (!isDragRef.current && Math.abs(dirX) !== Math.abs(dirY)) {
          if (Math.abs(dirX) > Math.abs(dirY)) {
            isDragRef.current = true;
          } else {
            if (cancel) cancel();
            return;
          }
        }

        if (event) {
          const isMouseDown = event.type === "mousedown";
          const isTouchDrag =
            (event.type === "touchend" || event.type === "touchmove") &&
            isDragRef.current;

          if (
            isMouseDown || // Prevent contents of carousel from being dragged
            isTouchDrag // Stop click emulation and reduce page scrolling on touch
          ) {
            event.cancelable && event.preventDefault();
            event.stopPropagation();
          }
        }

        const styler = stylerRef.current;
        const containerEl = containerElRef.current;
        const trackEl = trackElRef.current;

        if (!styler || !containerEl || !trackEl) {
          return;
        }

        // Limit dragging to within the bounds of the container
        const containerWidth = containerEl.offsetWidth;
        const trackWidth = trackEl.scrollWidth;
        const baseOffset = -((currentIndex / slideCount) * trackWidth);

        const leftOffset = baseOffset + deltaX;
        const rightOffset = leftOffset + (trackWidth - containerWidth);

        let overflow = 0;

        if (leftOffset > 0) {
          overflow = leftOffset;
        } else if (rightOffset < 0) {
          overflow = rightOffset;
        }

        const x = deltaX - overflow * 0.7;

        if (!last) {
          styler.set({ transition: "transform 0s", x });
          return;
        }

        styler.set({ transition: "", x: 0 });

        const width = trackEl.offsetWidth;

        const draggedSteps = (-x * currentShowCount) / width;
        const flickedSteps =
          Math.sqrt(Math.abs(vx) / 2) * (-Math.sign(vx) || 1);

        let stepChange = Math.round(draggedSteps + flickedSteps);

        // Restrict the maximum absolute change to the number of slides that are currently displayed
        stepChange = Math.min(
          Math.max(stepChange, -currentShowCount),
          currentShowCount
        );

        if (stepChange !== 0) {
          setCurrentIndex(currentIndex + stepChange); // We don't need to worry about indices being out of bounds - we'll handle that during render
        }
      },
    },
    { domTarget: targetElRef, eventOptions: { passive: false } }
  );

  // Create a `styler` instance for applying style changes to our carousel
  // without causing a re-render
  useEffect(() => {
    if (!trackElRef.current) {
      return;
    }

    stylerRef.current = styler(trackElRef.current);
  }, [trackElRef.current]);

  return (
    <div
      css={s(belt, _css, {
        overflow: "hidden",
        position: "relative",
      })}
      ref={targetElRef}
      {...bind()}
    >
      <div
        css={s({
          marginLeft: Array.isArray(gutter)
            ? gutter.map(negate)
            : negate(gutter),
          transform: (showCounts as (number | null)[]).map((count) =>
            count !== null
              ? `translate3d(-${(currentIndex * 100) / count}%, 0, 0)`
              : null
          ),
          transition: `transform ${transitionTime}ms`,
        })}
        ref={containerElRef}
      >
        <ul
          css={s({
            cursor: "grab",
            display: "flex",
            position: "relative",
            transition: `transform ${transitionTime}ms`,
            userSelect: "none",
          })}
          ref={trackElRef}
        >
          {slides.map((slide, index) => (
            <li
              css={s({
                flexShrink: 0,
                paddingLeft: gutter,
                width: (showCounts as (
                  | number
                  | null
                )[]).map((count: number | null) =>
                  count !== null ? `${100 / count}%` : null
                ),
              })}
              key={index}
            >
              {slide}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const defaultControls: Controls = {
  Dot,
  DotContainer,
  Next,
  Prev,
};

export interface CarouselUIProps
  extends ComponentStyleProps,
    CarouselSlidesProps {
  controls?: Partial<Controls>;
  innerCss?: ComponentStyleProps["_css"];
}

export const CarouselUI: FC<CarouselUIProps> = ({
  _css = {},
  controls,
  gutter,
  innerCss = {},
}) => {
  const {
    currentIndex,
    currentShowCount,
    isReady,
    setCurrentIndex,
    slideCount,
    slides,
    transitionTime,
  } = useCarouselController();
  const { t } = useLocale();

  const { Dot, DotContainer, Next, Prev } = { ...defaultControls, ...controls };

  return (
    <div css={s({ position: "relative" }, _css)}>
      <CarouselSlides
        _css={innerCss}
        gutter={gutter}
        transitionTime={transitionTime}
      />
      {DotContainer && Dot && (
        <DotContainer>
          {slides.map((_slide, index) => (
            <Dot
              key={index}
              active={isReady}
              index={index}
              onClick={() => setCurrentIndex(index)}
              title={t("carousel:controls.dot", {
                number: index + 1,
                total: slideCount,
              })}
              selected={currentIndex === index}
            />
          ))}
        </DotContainer>
      )}
      {Prev && (
        <Prev
          active={isReady && currentIndex > 0}
          onClick={() => setCurrentIndex(currentIndex - currentShowCount)}
          title={t("carousel:controls.previous")}
        />
      )}
      {Next && (
        <Next
          active={isReady && currentIndex < slideCount - currentShowCount}
          onClick={() => setCurrentIndex(currentIndex + currentShowCount)}
          title={t("carousel:controls.next")}
        />
      )}
    </div>
  );
};

export type CarouselProps = CarouselUIProps &
  Omit<CarouselControllerProps, "slides"> & {
    children: CarouselControllerProps["slides"];
  };

const Carousel: FC<CarouselProps> = ({
  children,
  slidesToShow,
  transitionTime,
  ...rest
}) => (
  <CarouselController
    slides={children}
    slidesToShow={slidesToShow}
    transitionTime={transitionTime}
  >
    <CarouselUI {...rest} />
  </CarouselController>
);

export default Carousel;
