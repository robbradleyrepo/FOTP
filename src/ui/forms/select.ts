import { s, StyleFn } from "@/common/ui/utils";

import chevronDown from "../icons/chevronDown";
import { dataUriFromPath } from "../styles/utils";
import { input, InputProps } from "./input";

export const select = (props: InputProps): StyleFn =>
  s(input(props), {
    "&[disabled]": {
      "& > option": {
        color: "inherit",
      },
      opacity: 1,
    },
    backgroundImage: `url("${dataUriFromPath({ path: chevronDown })}")`,
    backgroundPosition: "center right 16px",
    backgroundRepeat: "no-repeat",
    backgroundSize: 12,
  });
