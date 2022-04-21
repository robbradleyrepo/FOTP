import { act, fireEvent } from "@testing-library/react";
import React from "react";

import { anonymous } from "../../../sandbox";
import {
  TOAST_TIMEOUT,
  ToastRack,
  ToastType,
  useToastController,
} from "../toast";

const Test = () => {
  const { push } = useToastController();

  return (
    <>
      <ToastRack />
      <button
        onClick={() => push({ children: "Info toast", type: ToastType.INFO })}
      >
        Add info toast
      </button>
      <button
        onClick={() =>
          push({ children: "Warning toast", type: ToastType.WARNING })
        }
      >
        Add warning toast
      </button>
      <button
        onClick={() => push({ children: "Error toast", type: ToastType.ERROR })}
      >
        Add error toast
      </button>
    </>
  );
};

describe("<ToastRack /> + useToastController", () => {
  it("should render toasts, one at a time", async () => {
    const { component } = await anonymous.component({
      Component: <Test />,
    });

    const addErrorButton = component.getByText("Add error toast");
    const addInfoButton = component.getByText("Add info toast");
    const addWarningButton = component.getByText("Add warning toast");

    expect(component.queryByRole("alert")).toBeNull();

    act(() => {
      fireEvent.click(addInfoButton);
      fireEvent.click(addWarningButton);
      fireEvent.click(addErrorButton);
    });

    expect(component.getByRole("alert")).toHaveTextContent("Info toast");

    act(() => {
      fireEvent.click(component.getByText("Close"));
    });

    expect(component.getByRole("alert")).toHaveTextContent("Warning toast");

    act(() => {
      fireEvent.click(component.getByText("Close"));
    });

    expect(component.getByRole("alert")).toHaveTextContent("Error toast");
  });

  it("should automatically dismiss toasts", async () => {
    const { component } = await anonymous.component({
      Component: <Test />,
    });

    // Enable fake timers after render, otherwise it won't complete
    jest.useFakeTimers();

    const addErrorButton = component.getByText("Add error toast");
    const addInfoButton = component.getByText("Add info toast");
    const addWarningButton = component.getByText("Add warning toast");

    expect(component.queryByRole("alert")).toBeNull();

    act(() => {
      fireEvent.click(addInfoButton);
      fireEvent.click(addWarningButton);
      fireEvent.click(addErrorButton);
    });

    // Info toast
    expect(component.getByRole("alert")).toHaveTextContent("Info toast");

    act(() => {
      jest.runTimersToTime(TOAST_TIMEOUT[ToastType.INFO] - 1);
    });

    expect(component.getByRole("alert")).toHaveTextContent("Info toast");

    act(() => {
      jest.runTimersToTime(1);
    });

    // Warning toast
    expect(component.getByRole("alert")).toHaveTextContent("Warning toast");

    act(() => {
      jest.runTimersToTime(TOAST_TIMEOUT[ToastType.WARNING] - 1);
    });

    expect(component.getByRole("alert")).toHaveTextContent("Warning toast");

    act(() => {
      jest.runTimersToTime(1);
    });

    // Error toast
    expect(component.getByRole("alert")).toHaveTextContent("Error toast");

    act(() => {
      jest.runTimersToTime(TOAST_TIMEOUT[ToastType.ERROR] - 1);
    });

    expect(component.getByRole("alert")).toHaveTextContent("Error toast");

    act(() => {
      jest.runTimersToTime(1);
    });

    // None
    expect(component.queryByRole("alert")).toBeNull();

    jest.useRealTimers();
  });
});
