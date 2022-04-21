import { validatePassword } from "@sss/forms";
import { fireEvent } from "@testing-library/react";
import React from "react";

import { anonymous } from "../../../sandbox";
import Field from "../field";
import Form from "../form";

describe("<Field />", () => {
  it("should set the type of the contained Input", async () => {
    const type = "email";
    const { component } = await anonymous.component({
      Component: (
        <Form onSubmit={() => undefined}>
          {() => <Field label="Email" name="Email" type={type} />}
        </Form>
      ),
    });

    expect(component.getByRole("textbox")).toHaveAttribute("type", type);
  });

  it("should set the name of the contained Input", async () => {
    const name = "email";
    const { component } = await anonymous.component({
      Component: (
        <Form onSubmit={() => undefined}>
          {() => <Field label="Email" name={name} type="email" />}
        </Form>
      ),
    });

    expect(component.getByRole("textbox")).toHaveAttribute("name", name);
  });

  it("should render a label if prop is provided", async () => {
    const label = "label";
    const { component } = await anonymous.component({
      Component: (
        <Form onSubmit={() => undefined}>
          {() => <Field label={label} name="Email" type="email" />}
        </Form>
      ),
    });

    expect(component.getByLabelText(label)).toBeInTheDocument();
  });

  it("should add the aria label if provided", async () => {
    const label = "label";
    const { component } = await anonymous.component({
      Component: (
        <Form onSubmit={() => undefined}>
          {() => <Field label={label} name="Email" type="email" />}
        </Form>
      ),
    });

    expect(component.getByLabelText(label)).toBeInTheDocument();
  });

  it("should render a placeholder if prop is provided", async () => {
    const placeholder = "placeholder";
    const { component } = await anonymous.component({
      Component: (
        <Form onSubmit={() => undefined}>
          {() => {
            return (
              <Field
                label="Email"
                name="Email"
                type="email"
                placeholder={placeholder}
              />
            );
          }}
        </Form>
      ),
    });

    expect(component.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      placeholder
    );
  });

  it("should render an error if validation fails", async () => {
    const error = "error";
    const { component } = await anonymous.component({
      Component: (
        <Form onSubmit={() => undefined}>
          {() => {
            return (
              <Field
                label="Email"
                name="Email"
                type="email"
                validate={validatePassword(error)}
              />
            );
          }}
        </Form>
      ),
    });

    const input = component.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.blur(input);

    await expect(component.findByText(error)).resolves.toBeTruthy();
  });

  it("should render an error if there are field-level submission errors", async () => {
    const error = "error";
    const { component } = await anonymous.component({
      Component: (
        <Form
          label="Test form"
          onSubmit={() => ({
            Email: [error],
          })}
        >
          {() => <Field label="Email" name="Email" type="email" />}
        </Form>
      ),
    });

    const form = component.getByRole("form");

    fireEvent.submit(form);

    await expect(component.findByText(error)).resolves.toBeTruthy();
  });

  it("should throw an error a label is not provided in a non-production environment", async () => {
    const NODE_ENV = process.env.NODE_ENV;

    expect.assertions(5);

    expect(NODE_ENV).not.toBe("production");

    // Suppress the render error message
    const spy = jest
      .spyOn(console, "error")
      .mockImplementation(() => jest.fn());

    try {
      await anonymous.component({
        Component: (
          <Form onSubmit={() => undefined}>{() => <Field name="Email" />}</Form>
        ),
      });
    } catch (error) {
      expect(error).toEqual(
        new Error("A `Field` must have either a `label` or `ariaLabel`")
      );
    }

    // Reinstate error messages
    spy.mockClear();

    try {
      const ariaLabelResult = await anonymous.component({
        Component: (
          <Form onSubmit={() => undefined}>
            {() => <Field ariaLabel="Email" name="Email" />}
          </Form>
        ),
      });

      expect(ariaLabelResult).toBeDefined();

      const labelResult = await anonymous.component({
        Component: (
          <Form onSubmit={() => undefined}>
            {() => <Field label="Email" name="Email" />}
          </Form>
        ),
      });

      expect(labelResult).toBeDefined();

      // Simulate production mode
      (process.env.NODE_ENV as typeof process.env.NODE_ENV) = "production";

      const productionResult = await anonymous.component({
        Component: (
          <Form onSubmit={() => undefined}>{() => <Field name="Email" />}</Form>
        ),
      });

      expect(productionResult).toBeDefined();
    } catch (error) {
      expect(error).toBeUndefined();
    }

    // Reset the `NODE_ENV` env var
    (process.env.NODE_ENV as typeof process.env.NODE_ENV) = NODE_ENV;
  });
});
