export const COLOR = {
  box: "#B5BD89",
  box_special: "#F7B267",
  background: "#729EA1",
  food: "#F25C54",
} as const;

export type ColorNames = keyof typeof COLOR;
export type Color = typeof COLOR[ColorNames];
