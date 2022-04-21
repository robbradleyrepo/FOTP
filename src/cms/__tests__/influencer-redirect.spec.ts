import { Link, LinkType } from "@sss/prismic";

import { transformInfluencerRedirect } from "../influencer-redirect";

const invalidLinks: Link[] = [
  {
    _linkType: LinkType.document,
    _meta: {
      id: "Vr9GLaDyFKgTzB2t",
      lang: "en-us",
      tags: [],
      type: "influencer_redirect",
      uid: "test",
    },
  },
  {
    _linkType: LinkType.web,
    url: "https://us.fotp.com/account",
  },
];

describe("transformInfluencerRedirect", () => {
  it("should transform the provided `InfluencerRedirect` into `TransformedInfluencerRedirect`", () => {
    expect(
      transformInfluencerRedirect({
        _meta: {
          id: "NdHx3eubDE0YdR7I",
          lang: "en-us",
          tags: [],
          type: "influencer_redirect",
          uid: "test",
        },
        discountCode: "TEST10",
        message: [
          {
            spans: [],
            text:
              "Fans of end-to-end testing will be disappointed when they don’t get an extra 10% off game-changing dog supplements with code TEST10",
            type: "paragraph",
          },
        ],
        redirectUrl: {
          _linkType: LinkType.document,
          _meta: {
            id: "pSVcHv00qAmR9PlF",
            lang: "en-us",
            tags: [],
            type: "product_page",
            uid: "the-one",
          },
        },
      })
    ).toMatchSnapshot();

    expect(
      transformInfluencerRedirect({
        _meta: {
          id: "NdHx3eubDE0YdR7I",
          lang: "en-us",
          tags: [],
          type: "influencer_redirect",
          uid: "test",
        },
        discountCode: "TEST10",
        message: [
          {
            spans: [],
            text:
              "Fans of end-to-end testing will be disappointed when they don’t get an extra 10% off game-changing dog supplements with code TEST10",
            type: "paragraph",
          },
        ],
        redirectUrl: {
          _linkType: LinkType.web,
          url: "https://fotp.com/products/the-one?foo=bar",
        },
      })
    ).toMatchSnapshot();
  });

  it("should throw an error if any data is not set", () => {
    expect(() =>
      transformInfluencerRedirect({
        _meta: {
          id: "Hzfgl1fOn9JqJm2r",
          lang: "en-us",
          tags: [],
          type: "influencer_redirect",
          uid: "test",
        },
        discountCode: null,
        message: null,
        redirectUrl: null,
      })
    ).toThrowErrorMatchingSnapshot();
  });

  it("should throw an error if an empty message is provided", () => {
    expect(() =>
      transformInfluencerRedirect({
        _meta: {
          id: "GIhDhiYlLTsp9wEL",
          lang: "en-us",
          tags: [],
          type: "influencer_redirect",
          uid: "test",
        },
        discountCode: "TEST10",
        message: [
          {
            spans: [],
            text: " ",
            type: "paragraph",
          },
        ],
        redirectUrl: {
          _linkType: LinkType.document,
          _meta: {
            id: "pSVcHv00qAmR9PlF",
            lang: "en-us",
            tags: [],
            type: "product_page",
            uid: "the-one",
          },
        },
      })
    ).toThrowErrorMatchingSnapshot();
  });

  it("should throw an error if an invalid redirect URL is provided", () => {
    invalidLinks.forEach((redirectUrl) => {
      expect(() =>
        transformInfluencerRedirect({
          _meta: {
            id: "LjwxdECbjWw6U5x2",
            lang: "en-us",
            tags: [],
            type: "influencer_redirect",
            uid: "test",
          },
          discountCode: "TEST10",
          message: [
            {
              spans: [],
              text:
                "Fans of end-to-end testing will be disappointed when they don’t get an extra 10% off game-changing dog supplements with code TEST10",
              type: "paragraph",
            },
          ],
          redirectUrl,
        })
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
