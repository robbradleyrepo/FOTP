import { dataUriFromPath } from "../../styles/utils";

interface SquiggleOptions {
  color: string;
}

export const squiggleImageX = ({ color }: SquiggleOptions) =>
  dataUriFromPath({
    fill: "none",
    height: 8,
    path:
      "M1 1c5.001 0 5.001 6 9.996 6s5.002-6 9.997-6 5.001 6 9.996 6 5.002-6 10.003-6c5.002 0 5.002 6 9.997 6s4.975-6 10.002-6c5.028 0 5.002 6 10.003 6 5.002 0 5.002-6 10.003-6C86 1 86 7 91 7",
    stroke: color,
    "stroke-linecap": "round",
    viewBox: "0 0 92 8",
    width: 92,
  });

export const squiggleImageY = ({ color }: SquiggleOptions) =>
  dataUriFromPath({
    fill: "none",
    height: 52,
    path:
      "M7 51.001C7 46.006 1 46 1 41.005s6-5.001 6-10.003c0-5.001-6-5.001-6-9.996s6-4.976 6-10.003S1 6 1 1",
    stroke: color,
    "stroke-linecap": "round",
    viewBox: "0 0 8 52",
    width: 8,
  });

export const squiggleX = (options: SquiggleOptions) => ({
  backgroundImage: `url("${squiggleImageX(options)}")`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  height: 8,
  width: 92,
});

export const squiggleY = (options: SquiggleOptions) => ({
  backgroundImage: `url("${squiggleImageY(options)}")`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  height: 52,
  width: 8,
});
