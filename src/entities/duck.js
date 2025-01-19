import k from "../kaplayCtx";

export default class Duck {
  speed = 100;

  constructor() {
    const startingPos = [
      k.vec2(80, k.center().y + 40),
      k.vec2(k.center().x, k.center().y + 40),
      k.vec2(200, k.center().y + 40),
    ];

    const angles = [k.vec2(-0.5, -0.5), k.vec2(0.5, -0.5), k.vec2(1, -1)];

    const chosenPosIndex = k.randi(startingPos.length);
    const chosenAngleIndex = k.randi(angles.length);

    this.gameObj = k.add([
      k.sprite("duck", { anim: "flight-side" }),
      k.area(),
      k.body(),
      k.anchor("center"),
      k.pos(startingPos[chosenPosIndex]),
    ]);

    this.gameObj.onUpdate(() => {
      this.gameObj.move(k.vec2(angles[chosenAngleIndex]).scale(this.speed));
    });

    this.gameObj.onCollide("bounds", () => {});
  }
}
