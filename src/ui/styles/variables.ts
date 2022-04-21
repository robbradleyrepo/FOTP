const palette = {
  functional: {
    alt: "#5E867A",
    error: "#B2493B",
    light: "#DDE2DC",
    selected: "#5BBA8D",
    success: "#44AA23",
    warning: "#E9BE27",
    white: "#ffffff",
  },
  primary: {
    forest: "#185341",
    light: "#287C63",
  },
  secondary: {
    salmon: "#EE7861",
    salmonDark: "#DB5A41",
  },
  tints: {
    algae: "#D9E2D3",
    clay: "#ECDFCF",
    grass: "#7DAF6C",
    lightGreen: "#A4E5AF",
    moss: "#EDF0EC",
    mushroom: "#F2F0E7",
    peppermint: "#EAF2E6",
    pistachio: "#C3DBBB",
    sage: "#B7C2B6",
    sand: "#FFF3E1",
  },
};

const color = {
  accent: {
    dark: palette.secondary.salmonDark,
    light: palette.secondary.salmon,
  },
  background: {
    base: palette.functional.white,
    dark: palette.primary.forest,
    feature1: palette.tints.peppermint,
    feature2: palette.tints.mushroom,
    feature3: palette.tints.moss,
    feature4: palette.tints.sage,
    feature5: palette.tints.pistachio,
    feature6: palette.tints.sand,
    light: palette.primary.light,
    light2: palette.functional.light,
  },
  border: {
    dark: palette.primary.forest,
    error: palette.functional.error,
    light: palette.functional.light,
    mid: palette.tints.pistachio,
    selected: palette.functional.selected,
  },
  state: {
    alt: palette.functional.alt,
    error: palette.functional.error,
    selected: palette.functional.selected,
    success: palette.functional.success,
    warning: palette.functional.warning,
  },
  text: {
    dark: {
      base: palette.primary.forest,
      error: palette.functional.error,
    },
    light: {
      base: palette.functional.white,
    },
  },
  tint: {
    ...palette.tints,
  },
};

const breakpoint = {
  lg: 1140,
  md: 768,
  sm: 480,
  xl: 1280,
};

const spacing = {
  lg: 32,
  md: 24,
  sm: 16,
  xl: 48,
  xs: 8,
  xxl: 72,
  xxs: 4,
  xxxl: 128,
};

const radius = {
  lg: 16,
  md: 8,
  sm: 4,
  xl: 32,
  xs: 2,
  xxl: 32767,
};

const font = {
  primary: {
    family: "Avenir, sans-serif",
    weight: {
      bold: 700,
      book: 400,
      medium: 600,
    },
  },
  secondary: {
    family: "Circular, sans-serif",
    weight: {
      bold: 700,
      book: 400,
    },
  },
};

const height = {
  banner: {
    desktop: 54,
    mobile: 44,
  },
  nav: {
    desktop: 84,
    mobile: 68,
  },
  subnav: {
    desktop: 60,
    mobile: 45,
  },
};

export { breakpoint, color, font, height, radius, spacing };
