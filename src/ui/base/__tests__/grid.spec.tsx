import React from "react";
import { create } from "react-test-renderer";
import { mocked } from "ts-jest/utils";

import * as styles from "@/common/ui/utils";

import { Grid, GridAlignment, GridDirection, Item } from "../grid";

const mockStyleComposer = mocked(styles.s);

beforeEach(() => {
  jest.clearAllMocks();
});

describe.skip("<Item />", () => {
  it("should use the `Grid` component's X-axis gutter values as its left padding", () => {
    create(
      <Grid gx="item left padding">
        <Item />
      </Grid>
    );

    expect(mockStyleComposer).toMatchSnapshot();
  });

  it("should use the `Grid` component's Y-axis gutter values as its top padding", () => {
    create(
      <Grid gy="item top padding">
        <Item />
      </Grid>
    );

    expect(mockStyleComposer).toMatchSnapshot();
  });

  it("should use the `Grid` component's `itemWidth` as the default width", () => {
    create(
      <Grid itemWidth="item default width">
        <Item />
      </Grid>
    );

    expect(mockStyleComposer).toMatchSnapshot();
  });

  it("should use its own `width` value in preference to the `Grid` component's `itemWidth`", () => {
    create(
      <Grid itemWidth="item default width">
        <Item width="item width" />
      </Grid>
    );

    expect(mockStyleComposer).toMatchSnapshot();
  });
});

describe.skip("<Grid />", () => {
  it("should use the negative X-axis gutter values as the `ul` element's left margin", () => {
    create(<Grid gx="grid negative left margin" />);

    expect(mockStyleComposer).toMatchSnapshot();
    mockStyleComposer.mockClear();
  });

  it("should use the negative Y-axis gutter values as the `ul` element's top margin", () => {
    create(<Grid gy="grid negative top margin" />);

    expect(mockStyleComposer).toMatchSnapshot();
    mockStyleComposer.mockClear();
  });

  it("should set the appropriate flexbox item justification on the `ul` element", () => {
    [
      { _justifyContent: "flex-start", align: "left" },
      { _justifyContent: "center", align: "center", direction: "ltr" },
      { _justifyContent: "flex-start", align: "left", direction: "ltr" },
      { _justifyContent: "flex-end", align: "right", direction: "ltr" },
      { _justifyContent: "center", align: "center", direction: "rtl" },
      { _justifyContent: "flex-end", align: "left", direction: "rtl" },
      { _justifyContent: "flex-start", align: "right", direction: "rtl" },
    ].forEach(({ _justifyContent, align, direction }) => {
      const renderer = create(
        <Grid
          align={align as GridAlignment}
          direction={direction as GridDirection}
        />
      );

      const { props } = renderer.root.findByProps({ as: "ul" });

      expect(props).toMatchObject({ _justifyContent });
    });
  });

  it("should set the appropriate flexbox direction on the `ul` element", () => {
    [
      { _flexDirection: "row" },
      { _flexDirection: "row", direction: "ltr" },
      { _flexDirection: "row-reverse", direction: "rtl" },
    ].forEach(({ _flexDirection, direction }) => {
      const renderer = create(<Grid direction={direction as GridDirection} />);

      const { props } = renderer.root.findByProps({ as: "ul" });

      expect(props).toMatchObject({ _flexDirection });
    });
  });
});
