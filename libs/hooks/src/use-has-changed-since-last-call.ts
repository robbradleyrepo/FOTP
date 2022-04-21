import { useCallback, useEffect, useRef } from "react";

const useHasChangedSinceLastCall = () => {
  const calledRef = useRef(false);
  const depsRef = useRef<readonly unknown[]>();

  useEffect(() => {
    calledRef.current = false;
  });

  return useCallback((deps: readonly unknown[]) => {
    if (calledRef.current) {
      throw new Error("Function has already been called this render cycle");
    }

    const previous = depsRef.current;

    calledRef.current = true;
    depsRef.current = deps;

    return (
      !previous || deps.some((dep, index) => !Object.is(dep, previous[index]))
    );
  }, []);
};

export default useHasChangedSinceLastCall;
