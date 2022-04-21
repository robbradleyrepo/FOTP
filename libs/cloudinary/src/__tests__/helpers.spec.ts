import { getFetchedImageUrl, getUploadedImageUrl } from "../helpers";
import {
  CloudinaryFetchedImageUrlParams,
  CloudinaryFlag,
  CloudinaryMedia,
  CloudinaryUploadUrlParams,
} from "../types";

jest.mock("../config", () => ({
  CLOUDINARY_ORIGIN: "https://res.cloudinary.com",
  __esModule: true,
  default: { defaultCloudName: "cumulus", prefix: "/alto" },
}));

describe("getFetchedImageUrl", () => {
  it("should generate a URL based on the provided parameters", () => {
    expect(
      getFetchedImageUrl({
        cloudName: "stratus",
        quality: 123,
        type: CloudinaryMedia.VIDEO,
        url: "https://www.fillmurray.com/720/720",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use the `defaultCloudName` if no `cloudName` is provided", () => {
    expect(
      getFetchedImageUrl({
        quality: 123,
        type: CloudinaryMedia.IMAGE,
        url: "https://www.fillmurray.com/720/720",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use `auto` if no `quality` is provided", () => {
    expect(
      getFetchedImageUrl({
        cloudName: "stratus",
        type: CloudinaryMedia.IMAGE,
        url: "https://www.fillmurray.com/720/720",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use `image` if no `type` is provided", () => {
    expect(
      getFetchedImageUrl({
        cloudName: "stratus",
        quality: 123,
        url: "https://www.fillmurray.com/720/720",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use `auto` if no `width` is provided", () => {
    expect(
      getFetchedImageUrl({
        cloudName: "stratus",
        quality: 123,
        type: CloudinaryMedia.IMAGE,
        url: "https://www.fillmurray.com/720/720",
      })
    ).toMatchSnapshot();
  });

  it("should include flags in a consistent order", () => {
    const params: CloudinaryFetchedImageUrlParams = {
      cloudName: "stratus",
      quality: 123,
      type: CloudinaryMedia.IMAGE,
      url: "https://www.fillmurray.com/720/720",
      width: 456,
    };

    const x = getFetchedImageUrl({
      ...params,
      flags: [
        CloudinaryFlag.ANY_FORMAT,
        CloudinaryFlag.CLIP,
        CloudinaryFlag.LOSSY,
      ],
    });
    const y = getFetchedImageUrl({
      ...params,
      flags: [
        CloudinaryFlag.LOSSY,
        CloudinaryFlag.ANY_FORMAT,
        CloudinaryFlag.CLIP,
      ],
    });

    expect(x).toBe(y);
    expect(x).toMatchSnapshot();
  });

  it("should handle an empty array of flags", () => {
    expect(
      getFetchedImageUrl({
        cloudName: "stratus",
        flags: [],
        quality: 123,
        type: CloudinaryMedia.IMAGE,
        url: "https://www.fillmurray.com/720/720",
        width: 456,
      })
    ).toMatchSnapshot();
  });
});

describe("getUploadedImageUrl", () => {
  it("should generate a URL based on the provided parameters", () => {
    expect(
      getUploadedImageUrl({
        cloudName: "stratus",
        publicId: "/foo",
        quality: 123,
        type: CloudinaryMedia.VIDEO,
        version: "v1",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use the `defaultCloudName` if no `cloudName` is provided", () => {
    expect(
      getUploadedImageUrl({
        publicId: "/foo",
        quality: 123,
        type: CloudinaryMedia.IMAGE,
        version: "v1",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use `auto` if no `quality` is provided", () => {
    expect(
      getUploadedImageUrl({
        cloudName: "stratus",
        publicId: "/foo",
        type: CloudinaryMedia.IMAGE,
        version: "v1",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use `image` if no `type` is provided", () => {
    expect(
      getUploadedImageUrl({
        cloudName: "stratus",
        publicId: "/foo",
        quality: 123,
        version: "v1",
        width: 456,
      })
    ).toMatchSnapshot();
  });

  it("should use `auto` if no `width` is provided", () => {
    expect(
      getUploadedImageUrl({
        cloudName: "stratus",
        publicId: "/foo",
        quality: 123,
        type: CloudinaryMedia.IMAGE,
        version: "v1",
      })
    ).toMatchSnapshot();
  });

  it("should include flags in a consistent order", () => {
    const params: CloudinaryUploadUrlParams = {
      cloudName: "stratus",
      publicId: "/foo",
      quality: 123,
      type: CloudinaryMedia.IMAGE,
      version: "v1",
      width: 456,
    };

    const x = getUploadedImageUrl({
      ...params,
      flags: [
        CloudinaryFlag.ANY_FORMAT,
        CloudinaryFlag.CLIP,
        CloudinaryFlag.LOSSY,
      ],
    });
    const y = getUploadedImageUrl({
      ...params,
      flags: [
        CloudinaryFlag.LOSSY,
        CloudinaryFlag.ANY_FORMAT,
        CloudinaryFlag.CLIP,
      ],
    });

    expect(x).toBe(y);
    expect(x).toMatchSnapshot();
  });

  it("should handle an empty array of flags", () => {
    expect(
      getUploadedImageUrl({
        cloudName: "stratus",
        flags: [],
        publicId: "/foo",
        quality: 123,
        type: CloudinaryMedia.IMAGE,
        version: "v1",
        width: 456,
      })
    ).toMatchSnapshot();
  });
});
