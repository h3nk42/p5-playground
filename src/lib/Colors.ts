export const COLOR = {
  gold: "#ff70a6",
  greenLight: "#5465ff",
  green: "#00a8e8",
} as const;

export type ColorNames = keyof typeof COLOR;
export type Color = typeof COLOR[ColorNames];
