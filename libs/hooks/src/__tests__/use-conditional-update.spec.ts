import { act, renderHook } from "@testing-library/react-hooks";

import useConditionalUpdate from "../use-conditional-update";

describe("useConditionalUpdate", () => {
  it("should return a function that runs the provided update when the provided `shouldUpdate` function returns `true`", () => {
    const updater = jest.fn();
    const shouldUpdate = () => true;

    const { result } = renderHook(() =>
      useConditionalUpdate(updater, shouldUpdate)
    );

    const expectedArg = {
      foo: true,
    };

    act(() => {
      result.current(expectedArg);
    });

    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater).toHaveBeenCalledWith(expectedArg);
  });

  it("should return a function that does not run the provided update when the provided `shouldUpdate` function returns `false`", () => {
    const updater = jest.fn();
    const shouldUpdate = () => false;

    const { result } = renderHook(() =>
      useConditionalUpdate(updater, shouldUpdate)
    );

    act(() => {
      result.current({
        foo: true,
      });
    });

    expect(updater).not.toHaveBeenCalled();
  });

  it("should update the comparison value when `shouldUpdate` returns `true`", () => {
    const updater = jest.fn();
    const shouldUpdate = jest.fn(() => true);

    const { result } = renderHook(() =>
      useConditionalUpdate(updater, shouldUpdate, { pristine: true })
    );

    act(() => {
      result.current({ pristine: false });
    });

    expect(shouldUpdate).toHaveBeenCalledTimes(1);
    expect(shouldUpdate).toHaveBeenCalledWith(
      { pristine: false },
      { pristine: true }
    );

    act(() => {
      result.current({ foo: true });
    });

    expect(shouldUpdate).toHaveBeenCalledTimes(2);
    expect(shouldUpdate).toHaveBeenLastCalledWith(
      { foo: true },
      { pristine: false }
    );
  });

  it("should not update the comparison value when `shouldUpdate` returns `false`", () => {
    const updater = jest.fn();
    const shouldUpdate = jest.fn(() => false);

    const { result } = renderHook(() =>
      useConditionalUpdate(updater, shouldUpdate, { pristine: true })
    );

    act(() => {
      result.current({ pristine: false });
    });

    expect(shouldUpdate).toHaveBeenCalledTimes(1);
    expect(shouldUpdate).toHaveBeenCalledWith(
      { pristine: false },
      { pristine: true }
    );

    act(() => {
      result.current({ foo: true });
    });

    expect(shouldUpdate).toHaveBeenCalledTimes(2);
    expect(shouldUpdate).toHaveBeenLastCalledWith(
      { foo: true },
      { pristine: true }
    );
  });
});
