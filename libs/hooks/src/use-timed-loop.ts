import { useEffect, useRef, useState } from "react";

const useTimedLoop = <T>(arr: T[], interval: number) => {
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % arr.length;

      indexRef.current = nextIndex;
      setIndex(nextIndex);
    }, interval);
    return () => clearInterval(timer);
  }, [arr.length, interval]);

  return arr[index];
};

export default useTimedLoop;
