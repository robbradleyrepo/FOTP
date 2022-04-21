import { s } from "@/common/ui/utils";

export const card = s({
  "& img": {
    filter: "brightness(100%)",
    transition: "all 200ms ease-in-out",
  },
  cursor: "pointer",
  transform: [null, null, "scale(1)"],
  transition: "all 200ms ease-in-out",
});

export const interactiveCard = s(card, {
  "&:hover": {
    "& img": {
      filter: "brightness(95%)",
    },
    transform: [null, null, "scale(1.04)"],
  },
});
