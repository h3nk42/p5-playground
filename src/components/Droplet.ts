import { Coords } from "../lib/types";
import { program, FrameSubscriber } from "../main/Program";
import { DROPLETS } from "../main/Canvas";

export class Droplet implements FrameSubscriber {
  coords: Coords;
  genesisFrame: number;
  ttl: number = 1000;
  dead: boolean = false;

  constructor(coords: Coords) {
    program.addFrameSubscriber(this);
    this.coords = coords;
    this.genesisFrame = program.frameCounter;
  }

  getAge() {
    return program.frameCounter - this.genesisFrame;
  }

  executeEveryFrame() {
    if (!this.dead && this.ttl && this.ttl < this.getAge()) {
      DROPLETS.shift();
      this.dead = true;
    }
  }
}
