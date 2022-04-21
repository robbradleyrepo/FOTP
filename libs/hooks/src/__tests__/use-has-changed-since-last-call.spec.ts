import { renderHook } from "@testing-library/react-hooks";

import useHasChangedSinceLastCall from "../use-has-changed-since-last-call";

describe("useHasChangedSinceLastCall", () => {
  it("should return `true` if any of the provided values are different from the previous render", () => {
    const obj = { foo: "bar" };

    const renderHookResult = renderHook(() => useHasChangedSinceLastCall());

    expect(renderHookResult.result.current(["foo", obj, 123])).toBe(true);

    // New array, same deps
    renderHookResult.rerender();
    expect(renderHookResult.result.current(["foo", obj, 123])).toBe(false);

    // New array, different deps
    renderHookResult.rerender();
    expect(renderHookResult.result.current(["foo", { foo: "bar" }, 123])).toBe(
      true
    );
  });

  it("should throw an error if called more than once per render cycle", () => {
    const { result } = renderHook(() => useHasChangedSinceLastCall());

    expect(result.current([])).toBe(true);
    expect(() => result.current([])).toThrowError("");
  });
});
