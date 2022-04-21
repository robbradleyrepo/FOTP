import React from "react";

import { anonymous } from "../../sandbox";
import { RichText } from "../prismic";

const mockRichText = [
  {
    spans: [],
    text: "Lorem ipsum dolor sit amet",
    type: "heading1",
  },
  {
    spans: [],
    text:
      "Aliquam et augue tortor. Praesent mollis lectus a lacus rhoncus pharetra. Nullam quis dolor at magna efficitur faucibus. Curabitur at iaculis urna, in mattis lorem. Phasellus sodales metus mi. Nam lacinia erat vel ex interdum tincidunt. Vestibulum et fringilla nibh.",
    type: "paragraph",
  },
];

describe("<RichText />", () => {
  it("should render the provided Prismic rich text blocks", async () => {
    const { component } = await anonymous.component({
      Component: <RichText render={mockRichText} />,
    });

    expect(
      component.getByText("Lorem ipsum dolor sit amet", { selector: "h1" })
    ).toBeInTheDocument();
    expect(
      component.getByText(/^Aliquam et augue tortor/, { selector: "p" })
    ).toBeInTheDocument();
  });

  it("should use the provided components and default props", async () => {
    const { component } = await anonymous.component({
      Component: (
        <RichText
          components={{
            heading1: <blockquote lang="la" />,
          }}
          render={mockRichText}
        />
      ),
    });

    expect(
      component.getByText("Lorem ipsum dolor sit amet", {
        selector: "blockquote",
      })
    ).toHaveAttribute("lang", "la");
    expect(
      component.getByText(/^Aliquam et augue tortor/, { selector: "p" })
    ).toBeInTheDocument();
  });
});
