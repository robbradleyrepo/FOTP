import { renderHook } from "@testing-library/react-hooks";

import usePrevious from "../use-previous";

describe("usePrevious", () => {
  it("should return the prop from the previous render", () => {
    let renderHookResult: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    const values = ["foo", "baz", "bar"];

    values.forEach((value, index) => {
      if (!renderHookResult) {
        renderHookResult = renderHook((prop) => usePrevious(prop), {
          initialProps: value,
        });
      } else {
        renderHookResult.rerender(value);
      }

      expect(renderHookResult.result.current).toBe(values[index - 1]);
    });
  });
});
