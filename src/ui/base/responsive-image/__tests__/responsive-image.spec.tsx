import React from "react";

import IMG from "@/modules/home/assets/HERO.jpg";

import sandbox from "../../../../sandbox";
import ResponsiveImage, { getNextImageUrl } from "../";

test("<Image /> default loader route generation", async () => {
  // Why? We've copy+pasted the default loader logic to out of Next.js for internal use.
  // If this snapshot begins to fail, then the route generation logic has changed or the deviceSizes config.
  const { component } = await sandbox.component({
    Component: (
      <ResponsiveImage
        alt="img"
        sizes={{ width: ["100vw", "50vw", "33vw"] }}
        priority
        {...IMG}
      />
    ),
  });

  const img = await component.findByAltText("img");

  expect(img).toMatchSnapshot();
});

describe("getNextImageUrl generates expected routes", () => {
  it("should generate with default quality of 75", () => {
    expect(getNextImageUrl({ src: IMG.src, width: 100 })).toEqual(
      "/_next/image?url=%2Fexample%2Fimage.jpg&w=100&q=75"
    );
  });

  it("should generate with specified quality", () => {
    expect(getNextImageUrl({ quality: 50, src: IMG.src, width: 100 })).toEqual(
      "/_next/image?url=%2Fexample%2Fimage.jpg&w=100&q=50"
    );
  });
});
