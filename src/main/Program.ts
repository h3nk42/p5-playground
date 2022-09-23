import { Config } from "./Config";

class Program {
  frameCounter: number = 0;

  frameSubscribers: FrameSubscriber[] = [];
  onMouseClickedCallbacks: (() => void)[] = [];

  constructor() {
    Config.MOUSE_CALLBACKS.forEach((cb) => this.addOnMouseClickedCallback(cb));
  }

  incrementFrameCounter() {
    this.frameCounter++;
    this.callSubscribers();
  }

  callSubscribers() {
    this.frameSubscribers.forEach((subscriber) => {
      subscriber.executeEveryFrame(this.frameCounter);
    });
  }

  addOnMouseClickedCallback(callback: () => void) {
    this.onMouseClickedCallbacks.push(callback);
  }

  addFrameSubscriber(sub: FrameSubscriber) {
    this.frameSubscribers.push(sub);
  }

  executeOnMouseClickedCallbacks() {
    this.onMouseClickedCallbacks.forEach((cb) => cb());
  }
}

export interface FrameSubscriber {
  executeEveryFrame: (currentFrame: number) => any;
}

export const program = new Program();
