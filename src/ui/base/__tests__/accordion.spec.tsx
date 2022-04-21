import { act, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { anonymous } from "../../../sandbox";
import Accordion from "../accordion";

describe("<Accordion />", () => {
  it("should render specified label using the `labelAs` component and specified ID", async () => {
    const id = "foo";
    const label = "Bar";
    const labelAs = "h1";
    const { component } = await anonymous.component({
      Component: <Accordion id={id} label={label} labelAs={labelAs} />,
    });

    const button = component.getByText(label);

    expect(button.closest(labelAs)).toBeInTheDocument();
    expect(button).toHaveAttribute("id", id);
  });

  it("should render the provided content using the specified ID as a prefix", async () => {
    const id = "foo";
    const label = "Bar";
    const { component } = await anonymous.component({
      Component: <Accordion id={id} label={label} labelAs="h1" />,
    });

    const content = component.getByLabelText(label);

    expect(content).toHaveAttribute("id", `${id}-content`);
  });

  it("should default to hidden content if `initiallyOpen` is not `true`", async () => {
    const cases = [
      {
        hidden: true,
        initiallyOpen: undefined,
      },
      {
        hidden: true,
        initiallyOpen: false,
      },
      {
        hidden: false,
        initiallyOpen: true,
      },
    ];

    for (let i = 0; i < cases.length; i += 1) {
      const { hidden, initiallyOpen } = cases[i];

      const label = "Foo";
      const { component } = await anonymous.component({
        Component: (
          <Accordion
            id="foo"
            initiallyOpen={initiallyOpen}
            label={label}
            labelAs="h1"
          />
        ),
      });

      const button = component.getByText(label);
      const content = component.getByLabelText(label);

      expect(button).toHaveAttribute("aria-expanded", JSON.stringify(!hidden));

      if (hidden) {
        expect(content).toHaveAttribute("hidden", "");
      } else {
        expect(content).not.toHaveAttribute("hidden");
      }

      cleanup();
    }
  });

  it("should toggle the content visibility when the user clicks on the label", async () => {
    const label = "Foo";
    const { component } = await anonymous.component({
      Component: <Accordion id="foo" label={label} labelAs="h1" />,
    });

    const button = component.getByText(label);
    const content = component.getByLabelText(label);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveAttribute("hidden", "");

    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button).toHaveAttribute("aria-expanded", "true");
      expect(content).not.toHaveAttribute("hidden");
    });

    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(content).toHaveAttribute("hidden", "");
    });
  });
});
