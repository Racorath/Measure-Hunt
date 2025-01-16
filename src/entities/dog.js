import k from "../kaplayCtx";

export default class Dog {
  speed = 30;

  constructor(position) {
    this.gameObj = k.add([
      k.sprite("dog"),
      k.pos(position),
      k.state("search", ["search", "snif", "detect", "jump"]),
    ]);

    return this;
  }

  setDogAI() {
    let nbSnifs = 0;
    this.gameObj.onStateEnter("search", () => {
      this.gameObj.play("search");
      k.wait(2, () => {
        k.debug.log(nbSnifs);
        if (nbSnifs === 2) {
          this.gameObj.enterState("detect");
          return;
        }

        this.gameObj.enterState("snif");
      });
    });

    this.gameObj.onStateUpdate("search", () => {
      this.gameObj.move(this.speed, 0);
    });

    this.gameObj.onStateEnter("snif", () => {
      nbSnifs++;
      this.gameObj.play("snif");
      k.wait(2, () => {
        this.gameObj.enterState("search");
      });
    });
  }
}
