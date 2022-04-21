import store from "store/dist/store.modern";

import {
  captureTrackingParams,
  getCapturedTrackingParams,
} from "../attribution";

describe("captureTrackingParams", () => {
  afterEach(() => {
    store.clearAll();
  });

  it("should capture known tracking parameters", () => {
    captureTrackingParams(
      "?fbclid=123&gclid=456&utm_campaign=campaign&utm_content=content&utm_medium=medium&utm_source=source&utm_term=term&utm_unknown=unknown"
    );

    const captured = getCapturedTrackingParams();

    expect(captured).toEqual({
      fbclid: "123",
      gclid: "456",
      utm_campaign: "campaign",
      utm_content: "content",
      utm_medium: "medium",
      utm_source: "source",
      utm_term: "term",
    });
  });

  it("should update stored tracking parameters", () => {
    captureTrackingParams("?fbclid=123&utm_campaign=campaign1");

    captureTrackingParams("?fbclid=456");

    const captured = getCapturedTrackingParams();

    expect(captured).toEqual({
      fbclid: "456",
      utm_campaign: "campaign1",
    });
  });
});
