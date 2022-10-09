import { Droplet } from "../components/Droplet";
import { DROPLETS, p } from "./Canvas";
import { COLOR, Color } from "../lib/Colors";

export namespace Config {
  export const MOUSE_CALLBACKS = [
    () => DROPLETS.push(new Droplet({ x: p.mouseX, y: p.mouseY })),
  ];

  export const KEY_PRESS_CALLBACKS = [
    () => {},
  ];

  export const FRAMERATE = 60;

  export const DIMS = { w: 1000, h: 1000 };

  export const BG_COLOR: Color = COLOR.background;
}
