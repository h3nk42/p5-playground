import P5 from "p5";
import React, { FC } from "react";
import Sketch from "react-p5";
import { program } from "./Program";
import { Config } from "./Config";
import { Box } from "../components/Box";
import { Droplet } from "../components/Droplet";

// @ts-ignore
import SilkScreen from "../assets/fonts/Silkscreen-Bold.ttf";

export let p: P5;

export let Font: any;

export const Canvas: FC = () => {
  const setup = (p5: P5, canvasParentRef: Element) => {
    p = p5;
    p.frameRate(Config.FRAMERATE);
    p.createCanvas(Config.DIMS.w, Config.DIMS.h, "webgl").parent(
      canvasParentRef
    );
    p.rectMode("center");

    p.loadFont(SilkScreen, (font) => {
      Font = font;
      p.textFont(font);
    });
  };

  const draw = () => {
    p.background(Config.BG_COLOR);
    program.incrementFrameCounter();
  };

  const onMouseClicked = () => {
    program.executeOnMouseClickedCallbacks();
  };

  const onKeyPressed = () => {
    program.executeKeyPressCallbacks();
  };

  return (
    <Sketch
      // @ts-ignore
      setup={setup}
      draw={draw}
      mouseClicked={onMouseClicked}
      keyTyped={onKeyPressed}
    />
  );
};

const BOXES: Box.Default[] = [...Array(26).keys()]
  .map((x) =>
    [...Array(26).keys()].map((y) => ({
      x: x,
      y: y,
    }))
  )
  .reduce((a, b) => [...a, ...b], [])
  .map((coords, i) => new Box.Snake(coords, i));

export const DROPLETS: Droplet[] = [];
