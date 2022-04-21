import { act, renderHook } from "@testing-library/react-hooks";

import useTimedLoop from "../use-timed-loop";

jest.useFakeTimers();

describe("useTimedLoop", () => {
  it("should cycle through the provided array at the specified interval", () => {
    const values = ["foo", "baz", "bar"];
    const interval = 5000;

    const { result } = renderHook(() => useTimedLoop(values, interval));

    expect(result.current).toBe(values[0]);

    act(() => {
      jest.advanceTimersByTime(interval);
    });

    expect(result.current).toBe(values[1]);

    act(() => {
      jest.advanceTimersByTime(interval);
    });

    expect(result.current).toBe(values[2]);

    act(() => {
      jest.advanceTimersByTime(interval);
    });

    expect(result.current).toBe(values[0]);
  });
});
