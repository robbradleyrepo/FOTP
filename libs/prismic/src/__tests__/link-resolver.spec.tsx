import { captureException } from "@sentry/nextjs";
import { Link as InternalLink } from "@sss/next";
import React from "react";
import { create } from "react-test-renderer";
import { mocked } from "ts-jest/utils";

import {
  documentResolver,
  linkNormalizer,
  LinkResolver,
  linkResolver,
} from "../link-resolver";
import { ArticlePageTag, HyperlinkData, Link, LinkType } from "../types";

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));
jest.mock("@sss/i18n", () => ({
  Link: () => null,
}));

const mockedCaptureException = mocked(captureException);

const NODE_ENV = process.env.NODE_ENV;

afterEach(() => {
  jest.clearAllMocks();

  (process.env.NODE_ENV as unknown) = NODE_ENV;
});

describe("documentResolver", () => {
  describe("tag-based routes", () => {
    describe("article_page", () => {
      it("should map all known tag types", () => {
        expect(
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [ArticlePageTag.BLOG],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toBe("/blog/foo");

        expect(
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [ArticlePageTag.CONDITION],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toBe("/condition/foo");

        expect(
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [ArticlePageTag.INGREDIENT],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toBe("/ingredient/foo");

        expect(
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [ArticlePageTag.SUPPLEMENT],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toBe("/supplement/foo");
      });

      it("should map pages with multiple tags, giving priority to the first known tag", () => {
        expect(
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [ArticlePageTag.CONDITION, ArticlePageTag.BLOG],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toBe("/condition/foo");

        expect(
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [
                ArticlePageTag.SUPPLEMENT,
                ArticlePageTag.BLOG,
                ArticlePageTag.CONDITION,
              ],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toBe("/supplement/foo");

        expect(
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [
                "unknown",
                ArticlePageTag.INGREDIENT,
                ArticlePageTag.CONDITION,
              ],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toBe("/ingredient/foo");
      });

      it("should throw an error for pages without tags", () => {
        expect(() =>
          documentResolver({
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [],
              type: "article_page",
              uid: "foo",
            },
          })
        ).toThrowErrorMatchingSnapshot();
      });
    });

    describe("education_video", () => {
      it("should build valid path with tag namespace", () => {
        const docId = "education_video_idx";
        const courseTag = "course:abc";
        const courseId = courseTag.replace("course:", "");

        expect(
          documentResolver({
            _meta: {
              id: "0123456789xyz",
              lang: "us-en",
              lastPublicationDate: "2022-02-03T04:05:06.000Z",
              tags: [courseTag],
              type: "education_video",
              uid: docId,
            },
          })
        ).toBe(`/learn/${courseId}/${docId}`);
      });
    });
  });

  describe("handle-based routes", () => {
    [
      "batch_result",
      "expert",
      "landing_page",
      "product",
      "product_page",
    ].forEach((type) =>
      describe(type, () => {
        it("should interpolate the `{{ handle }}` placeholder", () => {
          expect(
            documentResolver({
              _meta: {
                id: "0123456789abcdef",
                lang: "us-en",
                lastPublicationDate: "2022-02-03T04:05:06.000Z",
                tags: [],
                type,
                uid: "foo",
              },
            })
          ).toMatchSnapshot();
        });

        it("should throw an error for pages without a UID", () => {
          expect(() =>
            documentResolver({
              _meta: {
                id: "0123456789abcdef",
                lang: "us-en",
                lastPublicationDate: "2022-02-03T04:05:06.000Z",
                tags: [],
                type,
              },
            })
          ).toThrowErrorMatchingSnapshot();
        });
      })
    );
  });

  describe("static routes", () => {
    [
      "evidence_page",
      "faq_page",
      "home_page",
      "ingredients_page",
      "experts_page",
      "testing_page",
    ].forEach((type) =>
      describe(type, () => {
        it("should interpolate the `{{ handle }}` placeholder", () => {
          expect(
            documentResolver({
              _meta: {
                id: "0123456789abcdef",
                lang: "us-en",
                lastPublicationDate: "2022-02-03T04:05:06.000Z",
                tags: [],
                type,
                uid: "foo",
              },
            })
          ).toMatchSnapshot();
        });
      })
    );
  });

  it("should by default throw an error for unmapped documents", () => {
    expect(() =>
      documentResolver({
        _meta: {
          id: "0123456789abcdef",
          lang: "us-en",
          lastPublicationDate: "2022-02-03T04:05:06.000Z",
          tags: [],
          type: "unknown",
          uid: "foo-bar",
        },
      })
    ).toThrowErrorMatchingSnapshot();
  });

  it("should return the fallback unmapped documents when specified", () => {
    expect(
      documentResolver(
        {
          _meta: {
            id: "0123456789abcdef",
            lang: "us-en",
            lastPublicationDate: "2022-02-03T04:05:06.000Z",
            tags: [],
            type: "unknown",
            uid: "foo-bar",
          },
        },
        "/some-fallback-page"
      )
    ).toEqual("/some-fallback-page");
  });
});

describe("linkNormalizer", () => {
  it("should handle Prismic documents", () => {
    expect(
      linkNormalizer({
        id: "XlOmChEAACUAkyRa",
        lang: "us-en",
        link_type: "Document", // eslint-disable-line @typescript-eslint/naming-convention
        tags: ["Foo"],
        type: "product",
        uid: "the-one",
      })
    ).toMatchSnapshot();
  });

  it("should handle files", () => {
    expect(
      linkNormalizer({
        kind: "document",
        link_type: "Media", // eslint-disable-line @typescript-eslint/naming-convention
        name: "mv-01620du-genista-potency.pdf",
        size: "204041",
        url:
          "https://prod-fotp-frontend.cdn.prismic.io/prod-fotp-frontend/bc2b9493-eafa-4394-b554-39dfe01f6cd4_mv-01620du-genista-potency.pdf",
      })
    ).toMatchSnapshot();
  });

  it("should handle images", () => {
    expect(
      linkNormalizer({
        height: "600",
        kind: "image",
        link_type: "Media", // eslint-disable-line @typescript-eslint/naming-convention
        name: "harmony-feature-subscribe-and-save.png",
        size: "176120",
        url:
          "https://images.prismic.io/prod-fotp-frontend/c142111c-666f-461a-ba43-f2e3af90edab_harmony-feature-subscribe-and-save.png?auto=compress,format",
        width: "737",
      })
    ).toMatchSnapshot();
  });

  it("should handle external links", () => {
    expect(
      linkNormalizer({
        link_type: "Web", // eslint-disable-line @typescript-eslint/naming-convention
        url: "https://us.fotp.com/",
      })
    ).toMatchSnapshot();
  });

  it("should throw on unknown link types", () => {
    expect(() =>
      linkNormalizer(({
        link_type: "Foo", // eslint-disable-line @typescript-eslint/naming-convention
      } as unknown) as HyperlinkData)
    ).toThrowErrorMatchingSnapshot();
  });
});

describe("linkResolver", () => {
  it("should map Prismic documents to their corresponding pages", () => {
    [
      {
        id: "0123456789abcdef",
        lang: "us-en",
        lastPublicationDate: "2022-02-03T04:05:06.000Z",
        tags: [],
        type: "product",
        uid: "foo-bar",
      },
      {
        id: "0123456789abcdef",
        lang: "us-en",
        lastPublicationDate: "2022-02-03T04:05:06.000Z",
        tags: [],
        type: "ingredients_page",
        uid: "not-used",
      },
    ].forEach((_meta) => {
      expect(
        linkResolver({
          _linkType: LinkType.document,
          _meta,
        })
      ).toBe(documentResolver({ _meta }));
    });
  });

  it("should convert internal `web` links to relative paths", () => {
    expect(
      linkResolver({
        _linkType: LinkType.web,
        url: "https://fotp.com",
      })
    ).toBe("/");

    expect(
      linkResolver({
        _linkType: LinkType.web,
        url: "https://fotp.com/foo/bar/baz",
      })
    ).toBe("/foo/bar/baz");
  });

  it("should remove legacy locale prefixes from internal `web` links", () => {
    expect(
      linkResolver({
        _linkType: LinkType.web,
        url: "https://fotp.com/us/en",
      })
    ).toBe("/");

    expect(
      linkResolver({
        _linkType: LinkType.web,
        url: "https://fotp.com/us/en/foo/bar/baz",
      })
    ).toBe("/foo/bar/baz");
  });

  it("should map media and external `web` links to their URLs", () => {
    expect(
      linkResolver({
        _linkType: LinkType.file,
        name: "Test",
        size: 123,
        url: "https://foo.bar/path/to/file.pdf",
      })
    ).toBe("https://foo.bar/path/to/file.pdf");

    expect(
      linkResolver({
        _linkType: LinkType.image,
        height: 456,
        name: "Test",
        size: 123,
        url: "https://foo.bar/path/to/image.jpg",
        width: 789,
      })
    ).toBe("https://foo.bar/path/to/image.jpg");

    expect(
      linkResolver({
        _linkType: LinkType.web,
        url: "https://foo.bar/",
      })
    ).toBe("https://foo.bar/");
  });
});

describe("<LinkResolver />", () => {
  it("should render mapped documents using an `InternalLink` or the provided `internal` component, with the mapped URL as its `to` prop", () => {
    const link: Link = {
      _linkType: LinkType.document,
      _meta: {
        id: "0123456789abcdef",
        lang: "us-en",
        tags: [],
        type: "product",
        uid: "foo-bar",
      },
    };

    const components = {
      internal: function InternalLink() {
        return null;
      },
    };
    const to = linkResolver(link);

    const defaultLink = create(<LinkResolver link={link} />).root.findByType(
      InternalLink
    );

    expect(defaultLink.props.to).toBe(to);

    const customLink = create(
      <LinkResolver components={components} link={link} />
    ).root.findByType(components.internal);

    expect(customLink.props.to).toBe(to);
  });

  it("should throw an error if a `link` is not provided when not in production", () => {
    expect(() => create(<LinkResolver />)).toThrowError("Missing `link` data");
  });

  it("should render using a `span` or the provided `fallback` component and log the error if a `link` is not provided in production", () => {
    (process.env.NODE_ENV as unknown) = "production";

    const components = {
      fallback: function Fallback() {
        return null;
      },
    };

    expect(create(<LinkResolver />).root.findByType("span")).toBeTruthy();

    expect(mockedCaptureException).toHaveBeenCalledWith(
      expect.objectContaining(new Error("Error: Missing `link` data")),
      { extra: { link: undefined } }
    );

    expect(
      create(<LinkResolver components={components} />).root.findByType(
        components.fallback
      )
    ).toBeTruthy();
  });

  it("should throw an error for unmapped documents when not in production", () => {
    expect(() =>
      create(
        <LinkResolver
          link={{
            _linkType: LinkType.document,
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              tags: [],
              type: "unknown",
              uid: "foo-bar",
            },
          }}
        />
      )
    ).toThrowError(
      'Unable to resolve document with type "unknown" and ID "0123456789abcdef"'
    );
  });

  it("should throw an error for unmapped education course video tags when not in production", () => {
    expect(() =>
      create(
        <LinkResolver
          link={{
            _linkType: LinkType.document,
            _meta: {
              id: "0123456789abcdef",
              lang: "us-en",
              tags: ["invalidCourseTag"],
              type: "education_video",
              uid: "foo-bar",
            },
          }}
        />
      )
    ).toThrowError(
      'Missing valid tags on education course episode page "foo-bar"'
    );
  });

  it("should render unmapped documents using a `span` or the provided `fallback` component and log the error in production", () => {
    (process.env.NODE_ENV as unknown) = "production";

    const link: Link = {
      _linkType: LinkType.document,
      _meta: {
        id: "0123456789abcdef",
        lang: "us-en",
        tags: [],
        type: "unknown",
        uid: "foo-bar",
      },
    };

    const components = {
      fallback: function Fallback() {
        return null;
      },
    };

    expect(
      create(<LinkResolver link={link} />).root.findByType("span")
    ).toBeTruthy();
    expect(
      create(
        <LinkResolver components={components} link={link} />
      ).root.findByType(components.fallback)
    ).toBeTruthy();

    expect(mockedCaptureException).toHaveBeenCalledWith(
      expect.objectContaining(
        new Error(
          'Unable to resolve document with type "unknown" and ID "0123456789abcdef"'
        )
      ),
      { extra: { link } }
    );
  });

  it("should render media and external links using an `a` or the provided `external` component", () => {
    const links: Link[] = [
      {
        _linkType: LinkType.file,
        name: "Test",
        size: 123,
        url: "https://foo.bar/file.pdf",
      },
      {
        _linkType: LinkType.image,
        height: 456,
        name: "Test",
        size: 123,
        url: "https://foo.bar/image.jpg",
        width: 789,
      },
      {
        _linkType: LinkType.web,
        url: "https://foo.bar/",
      },
    ];

    links.forEach((link) => {
      const components = {
        external: function ExternalLink() {
          return null;
        },
      };
      const href = linkResolver(link);

      const defaultLink = create(<LinkResolver link={link} />).root.findByType(
        "a"
      );

      expect(defaultLink.props.href).toBe(href);

      const customLink = create(
        <LinkResolver components={components} link={link} />
      ).root.findByType(components.external);

      expect(customLink.props.href).toBe(href);
    });
  });
});
