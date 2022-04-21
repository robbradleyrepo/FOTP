import { renderHook } from "@testing-library/react-hooks";

import useOnUnmount from "../use-on-unmount";

describe("useOnUnmount", () => {
  it("should call the most recently provided function when the hook unmounts", () => {
    const f1 = jest.fn();
    const f2 = jest.fn();
    const f3 = jest.fn();

    const renderHookResult = renderHook(({ fn }) => useOnUnmount(fn), {
      initialProps: {
        fn: f1,
      },
    });

    renderHookResult.rerender({ fn: f2 });
    renderHookResult.rerender({ fn: f3 });
    renderHookResult.unmount();

    expect(f1).not.toHaveBeenCalled();
    expect(f2).not.toHaveBeenCalled();
    expect(f3).toHaveBeenCalledTimes(1);
  });
});
