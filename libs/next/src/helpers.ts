import { ParsedUrlQuery, stringify } from "querystring";

enum PathType {
  CATCH_ALL = "CATCH_ALL",
  DYNAMIC = "DYNAMIC",
  OPTIONAL_CATCH_ALL = "OPTIONAL_CATCH_ALL",
}

export const getAsPath = (
  route: string,
  query?: ParsedUrlQuery,
  unmatched: "append" | "discard" = "append"
) => {
  // Make sure we haven't received a query string
  const [path, qs] = route.split("?");

  if (process.env.NODE_ENV !== "production" && qs) {
    throw new Error("The provided route must not include a query string");
  }

  const placeholders = new Map<string, { fragment: string; type: PathType }>();

  // Match all placeholders
  (path.match(/\/(\[[^/]+?\])(?=\/|$)/g) ?? []).forEach((match) => {
    const fragment = match.slice(1); // Remove leading backslash

    let key = fragment.slice(1, -1); // Remove square brackets
    let type = PathType.DYNAMIC;

    if (key.startsWith("...")) {
      key = key.slice(3);
      type = PathType.CATCH_ALL;
    }

    if (key.startsWith("[...") && key.endsWith("]")) {
      key = key.slice(4, -1);
      type = PathType.OPTIONAL_CATCH_ALL;
    }

    if (placeholders.has(key)) {
      throw new Error("Route contains duplicate param name");
    }

    placeholders.set(key, { fragment, type });
  });

  let asPath = path;
  const interpolables: ParsedUrlQuery = {
    ...query,
  };
  const unmatchedParams = new Set(Object.keys(interpolables));

  placeholders.forEach(({ fragment, type }, key) => {
    let value: string | string[] | undefined = interpolables[key];

    if (type === PathType.OPTIONAL_CATCH_ALL && !value) {
      value = [];
    }

    if (!value) {
      throw new Error("Missing query data for dynamic route");
    }

    if (Array.isArray(value) && type === PathType.DYNAMIC) {
      throw new Error("Arrays can only be used for catch-all routes");
    }

    // Encode and stringify values
    const parsedValue = Array.isArray(value)
      ? value.map(encodeURIComponent).join("/")
      : encodeURIComponent(value);

    asPath = asPath.replace(fragment, parsedValue).replace(/\/$/, "");

    unmatchedParams.delete(key);
  });

  if (unmatched === "append") {
    if (unmatchedParams.size > 0) {
      const query = [...unmatchedParams.keys()].reduce(
        (accum, key) => ({ ...accum, [key]: interpolables[key] }),
        {} as ParsedUrlQuery
      );
      asPath += `?${stringify(query)}`;
    }
  }

  return asPath;
};
