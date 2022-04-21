export const isDefined = <T>(value: T | null | undefined): value is T =>
  !!value;

export const isStringEnumMember = <E extends Record<string, string>>(
  e: E,
  value: string
): value is E[keyof E] => Object.values(e).includes(value);
