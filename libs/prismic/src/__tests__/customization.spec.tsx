import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import React from "react";

import {
  CustomizationProvider,
  ImageCustomization,
  RichTextCustomization,
  TitleCustomization,
} from "../customization";
import {
  CustomizationDict,
  CustomizationSliceType,
  ElementRendererDict,
  Elements,
} from "../types";

jest.mock("../../../cloudinary/src/config", () => ({
  CLOUDINARY_ORIGIN: "https://res.cloudinary.com",
  __esModule: true,
  default: { defaultCloudName: "test" },
}));

const children = <span data-testid="original">Hello World</span>;

const customizationDictionary: CustomizationDict = {
  image_customization: {
    foo: {
      primary: {
        image: {
          alt: null,
          dimensions: { height: 1000, width: 1000 },
          url:
            "https://images.prismic.io/prod-fotp-frontend/foo.jpg?auto=compress,format",
        },
        target: "foo",
      },
      type: CustomizationSliceType.IMAGE,
    },
  },
  rich_text_customization: {
    bar: {
      primary: {
        richText: [
          { spans: [], text: "One", type: "list-item" },
          { spans: [], text: "Two", type: "list-item" },
          { spans: [], text: "Three", type: "list-item" },
        ],
        target: "bar",
      },
      type: CustomizationSliceType.RICH_TEXT,
    },
  },
  title_customization: {
    baz: {
      primary: {
        target: "baz",
        title: [
          {
            spans: [],
            text: "New and improved",
            type: "paragraph",
          },
        ],
      },
      type: CustomizationSliceType.TITLE,
    },
  },
};

const emptyDictionary: CustomizationDict = {
  image_customization: {},
  rich_text_customization: {},
  title_customization: {},
};

describe("ImageCustomization", () => {
  const sizes = "100vw";
  const width = 123;
  const widths = [456, 789];

  it("should render the provided children if no customization is available", () => {
    ([
      [undefined, "foo"],
      [emptyDictionary, "foo"],
      [customizationDictionary, "blah"],
    ] as [CustomizationDict | undefined, string][]).forEach(
      ([dictionary, target]) => {
        render(
          <CustomizationProvider dictionary={dictionary}>
            <ImageCustomization
              sizes={sizes}
              target={target}
              width={width}
              widths={widths}
            >
              {children}
            </ImageCustomization>
          </CustomizationProvider>
        );

        expect(screen.getByTestId("original")).toBeInTheDocument();

        cleanup();
      }
    );
  });

  it("should render the customization, if available, using the provided attributes", () => {
    render(
      <CustomizationProvider dictionary={customizationDictionary}>
        <ImageCustomization
          sizes={sizes}
          target="foo"
          width={width}
          widths={widths}
        >
          {children}
        </ImageCustomization>
      </CustomizationProvider>
    );

    expect(screen.queryByTestId("original")).toBeNull();
    expect(screen.getByRole("img")).toMatchSnapshot();
  });
});

describe("RichTextCustomization", () => {
  const components: Partial<ElementRendererDict> = {
    [Elements.listItem]: <li data-testid="list-item" />,
  };

  it("should render the provided children if no customization is available", () => {
    ([
      [undefined, "bar"],
      [emptyDictionary, "bar"],
      [customizationDictionary, "blah"],
    ] as [CustomizationDict | undefined, string][]).forEach(
      ([dictionary, target]) => {
        render(
          <CustomizationProvider dictionary={dictionary}>
            <RichTextCustomization components={components} target={target}>
              {children}
            </RichTextCustomization>
          </CustomizationProvider>
        );

        expect(screen.getByTestId("original")).toBeInTheDocument();

        cleanup();
      }
    );
  });

  it("should render the customization, if available, using the provided components", () => {
    render(
      <CustomizationProvider dictionary={customizationDictionary}>
        <RichTextCustomization components={components} target="bar">
          {children}
        </RichTextCustomization>
      </CustomizationProvider>
    );

    expect(screen.queryByTestId("original")).toBeNull();
    expect(screen.getAllByTestId("list-item")).toMatchSnapshot();
  });
});

describe("TitleCustomization", () => {
  it("should render the provided children if no customization is available", () => {
    ([
      [undefined, "baz"],
      [emptyDictionary, "baz"],
      [customizationDictionary, "blah"],
    ] as [CustomizationDict | undefined, string][]).forEach(
      ([dictionary, target]) => {
        render(
          <CustomizationProvider dictionary={dictionary}>
            <TitleCustomization target={target}>{children}</TitleCustomization>
          </CustomizationProvider>
        );

        expect(screen.getByTestId("original")).toBeInTheDocument();

        cleanup();
      }
    );
  });

  it("should render the customization, if available, using the provided components", () => {
    render(
      <CustomizationProvider dictionary={customizationDictionary}>
        <h1 data-testid="heading">
          <TitleCustomization target="baz">{children}</TitleCustomization>
        </h1>
      </CustomizationProvider>
    );

    expect(screen.queryByTestId("original")).toBeNull();
    expect(screen.getByTestId("heading")).toMatchSnapshot();
  });
});
