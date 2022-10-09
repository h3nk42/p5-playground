import { Coords } from "../lib/types";
import { FrameSubscriber, program } from "../main/Program";
import { COLOR } from "../lib/Colors";
import { Config } from "../main/Config";
import { Box } from "./Box";
import { p } from "../main/Canvas";
import { Lib } from "../lib/lib";

const SNAKE_GAME_STATE = {
  playing: "playing",
  paused: "paused",
  gameOver: "gameOver",
} as const;

type SnakeGameState = keyof typeof SNAKE_GAME_STATE;

const DIRECTION = {
  l: "l",
  r: "r",
  u: "u",
  d: "d",
} as const;

type Direction = keyof typeof DIRECTION;

const base_speed = 5;

export class Snake implements FrameSubscriber {
  public bodyParts: Coords[] = [{ x: 1, y: 1 }];
  direction: Direction = DIRECTION.r;
  directionOfLastMove: Direction = DIRECTION.r;
  speed: number = base_speed;
  gameState: SnakeGameState = SNAKE_GAME_STATE.playing;
  public food: Coords = { x: 10, y: 10 };

  constructor() {
    program.addFrameSubscriber(this);
    program.addOnKeyPressedCallback((key) => {
      switch (key) {
        case 87:
          if (this.directionOfLastMove !== DIRECTION.d)
            this.direction = DIRECTION.u;
          break;
        case 68:
          if (this.directionOfLastMove !== DIRECTION.l)
            this.direction = DIRECTION.r;

          break;
        case 83:
          if (this.directionOfLastMove !== DIRECTION.u)
            this.direction = DIRECTION.d;
          break;
        case 65:
          if (this.directionOfLastMove !== DIRECTION.r)
            this.direction = DIRECTION.l;
          break;
      }
    });
  }

  executeEveryFrame() {
    switch (this.gameState) {
      case "playing":
        this.moveHead();
        this.checkIfFoodHit();
        break;
      case "gameOver":
        break;
    }
  }

  checkIfFoodHit() {
    if (Lib.assertEqualCoords(this.bodyParts[0], this.food)) {
      const newX = Math.floor(Math.random() * 23) + 1;
      const newY = Math.floor(Math.random() * 23) + 1;
      this.food = { x: newX, y: newY };
      this.bodyParts.push(this.bodyParts[0]);
      this.speed = this.speed + 1 / 3;
    }
  }

  moveHead() {
    if (
      program.frameCounter % Math.floor(Config.FRAMERATE / this.speed) ===
      0
    ) {
      let currentHead = this.bodyParts[0];
      switch (this.direction) {
        case "d":
          currentHead = { ...currentHead, y: currentHead.y + 1 };
          this.directionOfLastMove = DIRECTION.d;
          break;
        case "l":
          currentHead = { ...currentHead, x: currentHead.x - 1 };
          this.directionOfLastMove = DIRECTION.l;
          break;
        case "r":
          currentHead = { ...currentHead, x: currentHead.x + 1 };
          this.directionOfLastMove = DIRECTION.r;
          break;
        case "u":
          currentHead = { ...currentHead, y: currentHead.y - 1 };
          this.directionOfLastMove = DIRECTION.u;
          break;
      }
      if (Box.Snake.isBorder(currentHead)) {
        //this.gameState = SNAKE_GAME_STATE.gameOver;
        return;
      }
      this.bodyParts.pop();
      this.bodyParts.unshift(currentHead);
    }
  }
}

export namespace SnakeGame {
  export const Game = new Snake();

  export const Config = {
    boxcolors: {
      head: COLOR.box_special,
      border: COLOR.background,
    },
  } as const;
}
