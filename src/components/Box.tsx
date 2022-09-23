import { Color, COLOR } from "../lib/Colors";
import { Coords } from "../lib/types";
import _ from "lodash";
import { DROPLETS, p } from "../main/Canvas";
import { Lib } from "../lib/lib";
import { Config } from "../main/Config";
import { FrameSubscriber, program } from "../main/Program";

let specialBoxes = Lib.generateRandomArray(20, -1);

export namespace Box {
  export class Default implements FrameSubscriber {
    static maxW = 40;
    static minW = 10;

    id: number;

    coords: Coords;

    width: number = Box.Default.maxW;
    color: Color = COLOR.gold;
    special_color: Color = COLOR.greenLight;

    constructor(coords: Coords, id: number) {
      this.coords = coords;
      this.id = id;
      program.addFrameSubscriber(this);
    }

    executeEveryFrame() {
      this.dynamicRendering();
      this.drawBox();
    }

    dynamicRendering() {}

    isSpecial() {
      return specialBoxes.includes(this.id);
    }

    drawBox() {
      p.push();
      p.fill(this.isSpecial() ? this.special_color : this.color);
      p.translate(
        this.coords.x - Config.DIMS.w / 2,
        this.coords.y - Config.DIMS.h / 2,
        0
      );
      p.box(this.width);
      p.pop();
    }
  }

  export class Droplet extends Box.Default {
    dynamicRendering() {
      let lowestDistance = _.min(
        DROPLETS.map((droplet) =>
          Lib.getDistance1D(
            Lib.getDistance2D(this.coords, droplet.coords),
            droplet.getAge() * 3
          )
        )
      );

      this.width = Lib.mapRange(
        lowestDistance ?? 75,
        { min: 0, max: 75 },
        { min: Box.Default.minW, max: Box.Default.maxW },
        { max: Box.Default.maxW, min: 10 }
      );

      if (this.width < Box.Default.maxW / 2) {
        if (Math.random() > 0.7) {
          specialBoxes.shift();
          specialBoxes.push(this.id);
        }
      }
    }
  }
}
