import { EventType, fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import useOnInteraction from "../use-on-interaction";

describe("useOnInteraction", () => {
  const events: EventType[] = ["keyDown", "mouseOver", "touchStart"];

  it("should add the provided function as an event handler for keyboard, mouse and touch events", () => {
    events.forEach((event) => {
      const fn = jest.fn();

      renderHook(({ fn }) => useOnInteraction(fn), {
        initialProps: {
          fn,
        },
      });

      expect(fn).not.toHaveBeenCalled();

      fireEvent[event](window);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  it("should use the most recent function within the event handler", () => {
    events.forEach((event) => {
      const firstFn = jest.fn();
      const secondFn = jest.fn();

      const renderHookResult = renderHook(({ fn }) => useOnInteraction(fn), {
        initialProps: {
          fn: firstFn,
        },
      });

      renderHookResult.rerender({ fn: secondFn });

      expect(firstFn).not.toHaveBeenCalled();
      expect(secondFn).not.toHaveBeenCalled();

      fireEvent[event](window);

      expect(firstFn).not.toHaveBeenCalled();
      expect(secondFn).toHaveBeenCalledTimes(1);
    });
  });

  it("should not call the provided function more than once", () => {
    const fn = jest.fn();

    renderHook(({ fn }) => useOnInteraction(fn), {
      initialProps: {
        fn,
      },
    });

    expect(fn).not.toHaveBeenCalled();

    events.forEach((event) => {
      fireEvent[event](window);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should remove all event handlers when it unmounts", () => {
    const fn = jest.fn();

    const renderHookResult = renderHook(({ fn }) => useOnInteraction(fn), {
      initialProps: {
        fn,
      },
    });

    renderHookResult.unmount();

    expect(fn).not.toHaveBeenCalled();

    events.forEach((event) => {
      fireEvent[event](window);
    });

    expect(fn).not.toHaveBeenCalled();
  });
});
