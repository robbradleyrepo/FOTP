import { useEffect, useRef } from "react";

const useOnInteraction = (fn: () => void) => {
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasFiredRef.current) {
      return;
    }

    const events: (keyof WindowEventMap)[] = [
      "keydown",
      "mouseover",
      "touchstart",
    ];

    const cleanup = () =>
      events.forEach((event) => window.removeEventListener(event, handler));

    const handler = () => {
      fn();
      hasFiredRef.current = true;
      cleanup();
    };

    events.forEach((event) => {
      window.addEventListener(event, handler);
    });

    return cleanup;
  }, [fn]);
};

export default useOnInteraction;
