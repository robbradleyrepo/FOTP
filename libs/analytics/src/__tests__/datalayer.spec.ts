import { dataLayerPush, dataLayerTrack } from "../datalayer";

beforeEach(() => {
  (window as any).dataLayer = [];
});

describe("dataLayerPush", () => {
  it("should push value to datalayer", () => {
    dataLayerPush({
      event: "some_event",
    });

    expect(window.dataLayer).toEqual([
      {
        event: "some_event",
      },
    ]);
  });
});

describe("dataLayerTrack", () => {
  it("should push value to datalayer along with an event_id", () => {
    dataLayerTrack({
      event: "some_event",
    });

    expect(window.dataLayer).toEqual([
      {
        event: "some_event",
        event_id: expect.any(String),
      },
    ]);
  });
});
