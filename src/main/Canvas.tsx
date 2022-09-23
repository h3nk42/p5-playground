import P5 from "p5";
import React, { FC } from "react";
import Sketch from "react-p5";
import { program } from "./Program";
import { Config } from "./Config";
import { Box } from "../components/Box";
import { Droplet } from "../components/Droplet";

export let p: P5;

export const Canvas: FC = () => {
  const setup = (p5: P5, canvasParentRef: Element) => {
    p = p5;
    p.frameRate(Config.FRAMERATE);
    p.createCanvas(Config.DIMS.w, Config.DIMS.h, "webgl").parent(
      canvasParentRef
    );
    p.rectMode("center");
  };

  const draw = () => {
    p.background(Config.BG_COLOR);
    program.incrementFrameCounter();
  };

  const onMouseClicked = () => {
    program.executeOnMouseClickedCallbacks();
  };

  return (
    <Sketch
      // @ts-ignore
      setup={setup}
      draw={draw}
      mouseClicked={onMouseClicked}
    />
  );
};

const BOXES: Box.Default[] = [...Array(30).keys()]
  .map((h) =>
    [...Array(30).keys()].map((w) => ({
      x: Box.Default.maxW * w,
      y: Box.Default.maxW * h,
    }))
  )
  .reduce((a, b) => [...a, ...b], [])
  .map((coords, i) =>
    i % 2 === 0 ? new Box.Droplet(coords, i) : new Box.Default(coords, i)
  );

export const DROPLETS: Droplet[] = [];
