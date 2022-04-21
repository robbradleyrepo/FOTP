import { color } from "./variables";

interface DataUriFromPathParams {
  fill?: string;
  path: string;
  viewBox?: string;
  [k: string]: number | string | undefined;
}

const dataUriFromPath = ({
  fill = color.text.dark.base,
  path,
  viewBox = "0 0 100 100",
  ...rest
}: DataUriFromPathParams) => {
  const attributes = Object.entries(rest)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join("");

  return `data:image/svg+xml;charset=utf8,${encodeURIComponent(`<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg"${attributes}><path d="${path}" fill="${fill}" /></svg>
`)}`;
};

export { dataUriFromPath };
