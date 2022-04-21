import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";
import { useCallback, useEffect, useMemo, useRef } from "react";

const useBodyScrollLock = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  const lock = useCallback(() => {
    ref.current && disableBodyScroll(ref.current);
  }, []);
  const unlock = useCallback(() => {
    ref.current && enableBodyScroll(ref.current);
  }, []);

  useEffect(
    () => () => {
      // Clear all scroll locks before unmounting. Note that we can't do this
      // using `enableBodyScroll` as the `ref` will have already been removed
      clearAllBodyScrollLocks();
    },
    []
  );

  const bodyScrollLock = useMemo(
    () => ({
      lock,
      ref,
      unlock,
    }),
    [lock, unlock]
  );

  return bodyScrollLock;
};

export default useBodyScrollLock;
