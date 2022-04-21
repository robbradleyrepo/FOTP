import { dataUriFromPath } from "../../styles/utils";

interface WaveOptions {
  color: string;
}

export const wave = ({ color }: WaveOptions) => ({
  backgroundImage: `url("${dataUriFromPath({
    fill: color,
    height: 40,
    path: "M1600,40H0V19.5C533.3,87,1066.7-48,1600,19.5",
    preserveAspectRatio: "none",
    viewBox: "0 0 1600 40",
    width: 1600,
  })}")`,
  backgroundPosition: "center bottom",
  backgroundRepeat: "repeat-x",
  backgroundSize: ["100% 20px", "100% 30px", "100% 40px", "1600px 40px"],
  height: [20, 30, 40],
  width: "100%",
});
