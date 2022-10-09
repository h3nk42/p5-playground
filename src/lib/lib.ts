import { Coords } from "./types";

export namespace Lib {
  export const mapRange = (
    inputValue: number,
    input: { min: number; max: number },
    output: { min: number; max: number },
    cutoff?: { min?: number; max?: number }
  ) => {
    const slope = (output.max - output.min) / (input.max - input.min);

    const outputValue = output.min + slope * (inputValue - input.min);

    const cutoffValueMax = cutoff?.max
      ? outputValue > cutoff.max
        ? cutoff.max
        : outputValue
      : outputValue;

    const cutoffValueMin = cutoff?.min
      ? cutoffValueMax < cutoff.min
        ? cutoff.min
        : cutoffValueMax
      : cutoffValueMax;

    return cutoffValueMin;
  };

  export const getDistance2D = (a: Coords, b: Coords) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  export const getDistance1D = (a: number, b: number) => {
    return Math.abs(a - b);
  };

  export const generateRandomArray = (amount: number, max: number) => {
    return Array.from({ length: amount }, () =>
      Math.floor(Math.random() * max)
    );
  };

  export const assertEqualCoords = (a: Coords, b: Coords) => {
    return a.x === b.x && a.y === b.y;
  };
}
