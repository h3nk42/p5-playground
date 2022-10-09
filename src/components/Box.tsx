import { Color, COLOR } from "../lib/Colors";
import { Coords } from "../lib/types";
import _ from "lodash";
import { DROPLETS, p } from "../main/Canvas";
import { Lib } from "../lib/lib";
import { Config } from "../main/Config";
import { FrameSubscriber, program } from "../main/Program";
import { SnakeGame } from "./Snake";

let specialBoxes = Lib.generateRandomArray(20, -1);

export namespace Box {
  export class Default implements FrameSubscriber {
    static maxW = 40;
    static minW = 10;

    id: number;

    coords: Coords;

    width: number = Default.maxW;
    color: Color = COLOR.box;
    height: number = Default.maxW;

    constructor(coords: Coords, id: number) {
      this.coords = { x: coords.x * Default.maxW, y: coords.y * Default.maxW };
      this.id = id;
      program.addFrameSubscriber(this);
    }

    assertEqualCoords(coords: Coords) {
      const originalCoords = this.getOriginalCoords();
      return Lib.assertEqualCoords(coords, originalCoords);
    }

    getOriginalCoords() {
      return {
        x: this.coords.x / Default.maxW,
        y: this.coords.y / Default.maxW,
      };
    }

    executeEveryFrame() {
      this.dynamicRendering();
      this.drawBox();
    }

    dynamicRendering() {}

    drawBox() {
      p.push();
      p.fill(this.color);
      p.translate(
        this.coords.x - Config.DIMS.w / 2,
        this.coords.y - Config.DIMS.h / 2,
        0
      );
      p.box(this.width, this.height);
      p.pop();
    }
  }

  export class Droplet extends Box.Default {
    isSpecial() {
      return specialBoxes.includes(this.id);
    }

    assignColor() {
      this.color = this.isSpecial() ? COLOR.box_special : COLOR.box;
    }

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

  export class Snake extends Box.Default {
    bodyIndex: number = 1;

    isBody() {
      let body = false;
      SnakeGame.Game.bodyParts.forEach((coords, index) => {
        if (this.assertEqualCoords(coords)) {
          body = true;
          this.bodyIndex = index;
        }
      });
      return body;
    }

    isHead() {
      return this.assertEqualCoords(SnakeGame.Game.bodyParts[0]);
    }

    public static isBorder(coords: Coords) {
      return (
        coords.x === 0 || coords.x === 25 || coords.y === 0 || coords.y === 25
      );
    }

    isFood() {
      return this.assertEqualCoords(SnakeGame.Game.food);
    }

    assignStyle() {
      this.color =
        this.isHead() || this.isBody()
          ? SnakeGame.Config.boxcolors.head
          : Box.Snake.isBorder(this.getOriginalCoords())
          ? SnakeGame.Config.boxcolors.border
          : this.isFood()
          ? COLOR.food
          : COLOR.box;

      this.width = this.isHead()
        ? Default.maxW - 10
        : this.isBody()
        ? Default.maxW / 2 - this.bodyIndex
        : Default.maxW;

      this.height = this.isHead()
        ? Default.maxW - 10
        : this.isBody()
        ? Default.maxW / 2 - this.bodyIndex
        : this.isFood()
        ? Default.maxW / 3
        : Box.Default.maxW;
    }

    dynamicRendering() {
      this.assignStyle();
    }
  }
}
