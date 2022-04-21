import React, { FC, useEffect, useState } from "react";
import {
  IntersectionObserverProps as IntersectionObserverPropsBase,
  IntersectionOptions,
  useInView as useInViewBase,
} from "react-intersection-observer";
import { SetOptional } from "type-fest";

let polyfillIntersectionObserverPromise: Promise<unknown> | undefined;

const useIntersectionObserverPolyfill = () => {
  const [supported, setIsSupported] = useState(
    typeof window !== "undefined" && window.IntersectionObserver !== undefined
  );

  useEffect(() => {
    (async () => {
      if (window.IntersectionObserver === undefined) {
        if (!polyfillIntersectionObserverPromise) {
          polyfillIntersectionObserverPromise = import("intersection-observer");
        }

        await polyfillIntersectionObserverPromise;
      }

      setIsSupported(true);
    })();
  }, []);

  return supported;
};

export const useInView = (
  options?: IntersectionOptions
): [
  ((node?: Element | null | undefined) => void) | undefined,
  boolean,
  IntersectionObserverEntry | undefined
] => {
  const [ref, inView, maybeObserverEntry] = useInViewBase(options);
  const supported = useIntersectionObserverPolyfill();

  return [supported ? ref : undefined, inView, maybeObserverEntry];
};

type RenderProps = SetOptional<
  Parameters<IntersectionObserverPropsBase["children"]>[0],
  "ref"
>;

interface IntersectionObserverProps extends IntersectionOptions {
  children: (fields: RenderProps) => React.ReactNode;
}

export const InView: FC<IntersectionObserverProps> = ({
  children,
  ...options
}) => {
  const [ref, inView, entry] = useInView(options);

  return <>{children({ entry, inView, ref })}</>;
};
