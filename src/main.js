import { loadAssets } from "./assetLoader";
import { COLORS } from "./constants";
import Dog from "./entities/dog";
import k from "./kaplayCtx";

loadAssets();

k.scene("main-menu", () => {
  k.add([k.sprite("menu")]);

  k.add([
    k.text("CLICK TO START", { font: "nes", size: 8 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 40),
  ]);

  k.add([
    k.text("000000", { font: "nes", size: 8 }),
    k.pos(150, 184),
    k.color(k.Color.fromHex(COLORS.GREEN)),
  ]);

  k.onClick(() => {
    k.go("game");
  });
});

k.scene("game", () => {
  k.setCursor("none");
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex(COLORS.BLUE))]);
  k.add([k.sprite("background"), k.pos(0, -10)]);

  // k.add([k.sprite("dog", { anim: "searching" }), k.pos(-64, k.center().y)]);
  const dog = new Dog(k.vec2(-64, k.center().y));
  dog.setDogAI();

  const cursor = k.add([
    k.sprite("cursor"), // sprite
    k.anchor("center"),
    k.pos(),
  ]);
  cursor.onUpdate(() => {
    cursor.moveTo(k.mousePos());
  });
});

k.go("main-menu");
