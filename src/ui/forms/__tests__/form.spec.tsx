import { fireEvent, waitFor } from "@testing-library/react";
import { FORM_ERROR } from "final-form";
import React from "react";

import { anonymous } from "../../../sandbox";
import Field from "../field";
import Form from "../form";

describe("<Form />", () => {
  it("should render an error if validation fails", async () => {
    const error = "error";
    const { component } = await anonymous.component({
      Component: (
        <Form
          onSubmit={async () => {
            return { [FORM_ERROR]: [error] };
          }}
        >
          {() => (
            <>
              <Field label="Email" name="email" type="email" />
              <button type="submit">Submit</button>
            </>
          )}
        </Form>
      ),
    });

    const el = await component.findByText("Submit");

    fireEvent.click(el);

    waitFor(() => {
      const err = component.findByText("error");
      expect(err).toContain(error);
    });
  });
});
