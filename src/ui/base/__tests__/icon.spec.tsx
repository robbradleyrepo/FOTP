import React from "react";
import { create } from "react-test-renderer";

import Icon from "../icon";

describe("<Icon />", () => {
  const path = "foo";

  it("should render the provided path", () => {
    const renderer = create(<Icon path={path} />);

    const { props } = renderer.root.findByType("path");

    expect(props).toMatchObject({ d: path });
  });

  describe("title", () => {
    it("should render the provided title", () => {
      const title = "Foo Bar Baz";

      const renderer = create(<Icon path={path} title={title} />);

      const { props } = renderer.root.findByType("title");

      expect(props).toMatchObject({ children: title });
    });

    it("should omit the `title` element if a title is not provided", () => {
      const renderer = create(<Icon path={path} />);

      const { props } = renderer.root.findByType("svg");

      expect(props).toMatchObject({ role: "presentation" });

      expect(() => renderer.root.findByType("title")).toThrow();
    });

    it("should not add a `presentation` role to the SVG element if a title is provided", () => {
      const title = "Foo Bar Baz";

      const renderer = create(<Icon path={path} title={title} />);

      const { props } = renderer.root.findByType("svg");

      expect(props.role).toBeUndefined();
    });

    it("should add a `presentation` role to the SVG element if a title not is provided", () => {
      const renderer = create(<Icon path={path} />);

      const { props } = renderer.root.findByType("svg");

      expect(props).toMatchObject({ role: "presentation" });
    });
  });
});
