import { useEffect, useRef, useState } from "react";

export interface UseScriptState {
  error: ErrorEvent | null;
  loaded: boolean;
}
export interface UseLazyScriptProps {
  checkForExisting?: boolean;
  src: HTMLScriptElement["src"];
}

export const useLazyScript = ({
  src,
  checkForExisting = true,
}: UseLazyScriptProps): [() => void, UseScriptState] => {
  const isBrowser = typeof window !== "undefined";

  const [state, setState] = useState<UseScriptState>({
    error: null,
    loaded: false,
  });

  const load = () => {
    if (!isBrowser) return;

    if (checkForExisting) {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return;
    }

    const scriptEl = document.createElement("script");
    scriptEl.setAttribute("src", src);
    scriptEl.async = true;

    const handleLoad = () =>
      setState({
        ...state,
        loaded: true,
      });

    const handleError = (error: ErrorEvent) =>
      setState({
        ...state,
        error,
      });

    scriptEl.addEventListener("load", handleLoad);
    scriptEl.addEventListener("error", handleError);

    document.body.appendChild(scriptEl);

    return () => {
      scriptEl.removeEventListener("load", handleLoad);
      scriptEl.removeEventListener("error", handleError);
    };
  };

  return [load, state];
};

export interface UseScriptProps extends UseLazyScriptProps {
  enabled?: boolean;
}

export const useScript = ({
  enabled = true,
  src,
  checkForExisting = false,
}: UseScriptProps): UseScriptState => {
  const [load, state] = useLazyScript({ checkForExisting, src });
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current || !enabled) {
      return;
    }

    load();
    hasRunRef.current = true;
  }, [enabled, load, src]);

  return state;
};

export default useScript;
