import { useEffect, useRef } from "react";

const useOnUnmount = (fn: () => void) => {
  const ref = useRef(fn);

  // Update the ref each render
  ref.current = fn;

  useEffect(() => () => ref.current(), []);
};

export default useOnUnmount;
