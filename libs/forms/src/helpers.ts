export const removeEmptyFields = <T extends Record<keyof T, unknown>>(
  values: T
): Partial<T> =>
  Object.entries(values ?? {}).reduce(
    (accum, [key, value]) =>
      value === undefined || value === null
        ? accum
        : { ...accum, [key]: value },
    {}
  );
