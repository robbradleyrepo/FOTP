import { fireEvent, RenderResult } from "@testing-library/react";
import React from "react";

import { anonymous } from "../../../sandbox";
import { useModalController, useModalState } from "../modal";

const Test = () => {
  const alphaControls = useModalController("alpha");
  const betaControls = useModalController("beta");
  const modalState = useModalState();

  return (
    <>
      <button onClick={() => alphaControls.setIsOpen(true)}>
        Open alpha modal
      </button>
      <button onClick={() => alphaControls.setIsOpen(false)}>
        Close alpha modal
      </button>
      <button onClick={() => betaControls.setIsOpen(true)}>
        Open beta modal
      </button>
      <button onClick={() => betaControls.setIsOpen(false)}>
        Close beta modal
      </button>
      <ul>
        <li>Alpha modal is {alphaControls.open ? "open" : "closed"}</li>
        <li>Beta modal is {betaControls.open ? "open" : "closed"}</li>
        <li>{modalState ? "A modal is open" : "No modals are open"}</li>
      </ul>
    </>
  );
};

const expectAlpha = (component: RenderResult) => {
  expect(component.getByText("Alpha modal is open")).toBeInTheDocument();
  expect(component.getByText("Beta modal is closed")).toBeInTheDocument();
  expect(component.getByText("A modal is open")).toBeInTheDocument();
};

const expectBeta = (component: RenderResult) => {
  expect(component.getByText("Alpha modal is closed")).toBeInTheDocument();
  expect(component.getByText("Beta modal is open")).toBeInTheDocument();
  expect(component.getByText("A modal is open")).toBeInTheDocument();
};

const expectNone = (component: RenderResult) => {
  expect(component.getByText("Alpha modal is closed")).toBeInTheDocument();
  expect(component.getByText("Beta modal is closed")).toBeInTheDocument();
  expect(component.getByText("No modals are open")).toBeInTheDocument();
};

describe("useModalController", () => {
  it("should default to all modals being closed", async () => {
    const { component } = await anonymous.component({
      Component: <Test />,
    });

    expectNone(component);
  });

  it("should open/close the appropriate modal when `setIsOpen` is called", async () => {
    const { component } = await anonymous.component({
      Component: <Test />,
    });

    const alphaCloseButton = component.getByText("Close alpha modal");
    const alphaOpenButton = component.getByText("Open alpha modal");
    const betaCloseButton = component.getByText("Close beta modal");
    const betaOpenButton = component.getByText("Open beta modal");

    // No modals open -> one modal
    fireEvent.click(alphaOpenButton);
    expectAlpha(component);

    // No change when closing the other modal
    fireEvent.click(betaCloseButton);
    expectAlpha(component);

    // No change when opening current modal again
    fireEvent.click(alphaOpenButton);
    expectAlpha(component);

    // Modal closes correctly
    fireEvent.click(alphaCloseButton);
    expectNone(component);

    // No modals open -> one modal
    fireEvent.click(betaOpenButton);
    expectBeta(component);

    // No change when closing the other modal
    fireEvent.click(alphaCloseButton);
    expectBeta(component);

    // No change when opening current modal again
    fireEvent.click(betaOpenButton);
    expectBeta(component);

    // Modal closes correctly
    fireEvent.click(betaCloseButton);
    expectNone(component);

    // No change when closing a closed modal
    fireEvent.click(alphaCloseButton);
    expectNone(component);

    fireEvent.click(betaCloseButton);
    expectNone(component);

    // No problems switching between modals
    fireEvent.click(alphaOpenButton);
    expectAlpha(component);

    fireEvent.click(betaOpenButton);
    expectBeta(component);

    fireEvent.click(alphaOpenButton);
    expectAlpha(component);
  });
});
