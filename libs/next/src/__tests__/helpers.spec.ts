import { getAsPath } from "../helpers";

describe("getAsPath", () => {
  it("should replace all other dynamic route placeholders with the provided values from the query", () => {
    const route = "/bar/[baz]";
    const query = {
      baz: "foo",
    };

    expect(getAsPath(route, query)).toBe(`/bar/${query.baz}`);
  });

  it("should handle catch-all placeholders", () => {
    const route = `/[...baz]`;

    expect(
      getAsPath(route, {
        baz: "foo",
      })
    ).toBe(`/foo`);
    expect(
      getAsPath(route, {
        baz: ["foo", "bar"],
      })
    ).toBe(`/foo/bar`);
  });

  it("should handle optional catch-all placeholders", () => {
    const route = `/[[...baz]]`;

    expect(getAsPath(route, {})).toBe(``);
    expect(
      getAsPath(route, {
        baz: "foo",
      })
    ).toBe(`/foo`);
    expect(
      getAsPath(route, {
        baz: ["foo", "bar"],
      })
    ).toBe(`/foo/bar`);
  });

  it("should append the query string from any unmatched query parameters", () => {
    const route = `/bar/[baz]`;
    const query = {
      baz: "foo",
      key: "value",
    };

    expect(getAsPath(route, query, "append")).toBe(`/bar/foo?key=value`);
  });

  it("should discard the query string from any unmatched query parameters", () => {
    const route = `/bar/[baz]`;
    const query = {
      baz: "foo",
      key: "value",
    };

    expect(getAsPath(route, query, "discard")).toBe("/bar/foo");
  });

  it("should throw if an invalid route is provided", () => {
    const route = `/[foo]/[foo]`;

    expect(() => getAsPath(route)).toThrowError(
      "Route contains duplicate param name"
    );
  });

  it("should throw if an invalid query is provided", () => {
    const route = `/[baz]`;
    const query = {
      baz: ["foo", "bar"],
    };

    expect(() => getAsPath(route, query)).toThrowError(
      "Arrays can only be used for catch-all routes"
    );
  });
});
