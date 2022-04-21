import { advanceTo } from "jest-date-mock";
import React from "react";

import { anonymous } from "../../../sandbox";
import Contact from "../contact";

jest.useFakeTimers();

const businessHours = [
  "2021-01-01T09:00:00.000-08:00", // Friday (PST)
  "2021-01-01T16:59:59.999-08:00", // Friday (PST)
  "2021-07-01T09:00:00.000-07:00", // Thursday (PDT)
  "2021-07-01T16:59:59.999-07:00", // Thursday (PDT)
];
const nonBusinessHours = [
  "2021-01-02T09:00:00.000-08:00", // Saturday (PST)
  "2021-01-03T09:00:00.000-08:00", // Sunday (PST)
  "2021-01-01T08:59:59.999-08:00", // Friday (PST)
  "2021-01-01T17:00:00.000-08:00", // Friday (PST)
  "2021-07-01T08:59:59.999-07:00", // Thursday (PDT)
  "2021-07-01T17:00:00.000-07:00", // Thursday (PDT)
];

describe("<Contact />", () => {
  it("should render the customer service phone number during business hours", async () => {
    for (let i = 0; i < businessHours.length; i += 1) {
      advanceTo(new Date(businessHours[i]));

      const { component } = await anonymous.component({
        Component: <Contact />,
      });

      await expect(component.findByRole("link")).resolves.toMatchSnapshot();
    }
  });

  it("should render the customer service email address outside of business hours", async () => {
    for (let i = 0; i < nonBusinessHours.length; i += 1) {
      advanceTo(new Date(nonBusinessHours[i]));

      const { component } = await anonymous.component({
        Component: <Contact />,
      });

      await expect(component.findByRole("link")).resolves.toMatchSnapshot();
    }
  });
});
