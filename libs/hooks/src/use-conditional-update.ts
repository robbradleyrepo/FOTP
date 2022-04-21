import { useRef } from "react";

type UpdateCheck<T extends Record<string, unknown>> = (
  input: T,
  values: Partial<T>
) => boolean;

const useConditionalUpdate = <T extends Record<string, unknown>>(
  updater: (update: T) => unknown,
  shouldUpdate: UpdateCheck<T>,
  initialValues: Partial<T> = {}
) => {
  const valuesRef = useRef<Partial<T>>(initialValues);

  return (update: T) => {
    if (shouldUpdate(update, valuesRef.current)) {
      valuesRef.current = update;

      return updater(update);
    }
  };
};

export default useConditionalUpdate;
