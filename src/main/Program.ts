import { Config } from "./Config";
import { p } from "./Canvas";

class Program {
  frameCounter: number = 1;

  frameSubscribers: FrameSubscriber[] = [];
  onMouseClickedCallbacks: (() => void)[] = [];
  onKeyPressedCallbacks: ((keyCode: number) => void)[] = [];

  constructor() {
    Config.MOUSE_CALLBACKS.forEach((cb) => this.addOnMouseClickedCallback(cb));
    Config.KEY_PRESS_CALLBACKS.forEach((cb) =>
      this.addOnKeyPressedCallback(cb)
    );
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

  addOnKeyPressedCallback(callback: (keyCode: number) => void) {
    this.onKeyPressedCallbacks.push(callback);
  }

  addFrameSubscriber(sub: FrameSubscriber) {
    this.frameSubscribers.push(sub);
  }

  executeOnMouseClickedCallbacks() {
    this.onMouseClickedCallbacks.forEach((cb) => cb());
  }

  executeKeyPressCallbacks() {
    this.onKeyPressedCallbacks.forEach((cb) => cb(p.keyCode));
  }
}

export interface FrameSubscriber {
  executeEveryFrame: (currentFrame: number) => any;
}

export const program = new Program();
