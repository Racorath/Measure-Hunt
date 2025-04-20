import k from "./kaplayCtx";

export function loadAssets() {

  k.loadSprite("background", "./graphics/background.png");
  k.loadSprite("backgroundpvp", "./graphics/backgroundpvp.png");
  k.loadSprite("backgroundwhole", "./graphics/backgroundwhole.png");
  k.loadSprite("backgroundfraction", "./graphics/backgroundfraction.png");
  k.loadSprite("backgroundmeasure", "./graphics/backgroundmeasure.png");
  k.loadSprite("backgrounddecimal", "./graphics/backgrounddecimal.png");
  k.loadSprite("menu", "./graphics/menu.png");
  k.loadSprite("choosemode", "./graphics/choosemode.png");
  k.loadSprite("cursor", "./graphics/cursor.png");
  k.loadSprite("cursor1", "./graphics/cursor1.png");
  k.loadSprite("cursor2", "./graphics/cursor2.png");
  k.loadSprite("pausebutton", "./graphics/pausebutton.png"); // Add pausebutton sprite
  k.loadSprite("blackprogress", "./graphics/blackprogress.png");

  // Add pie sprite with horizontal slicing for fraction progress
  k.loadSprite("pie", "./graphics/pie.png", {
    sliceX: 8, // 8 horizontal slices for different fill levels
    sliceY: 1,
    anims: {
      // Define frames for each fill level (0/8 through 8/8)
      "fill-0": 0,
      "fill-1": 1,
      "fill-2": 2,
      "fill-3": 3,
      "fill-4": 4,
      "fill-5": 5,
      "fill-6": 6, 
      "fill-7": 7
    }
  });

  k.loadFont("nes", "./fonts/nintendo-nes-font/nintendo-nes-font.ttf");
  k.loadSprite("dog", "./graphics/dog.png", {
    sliceX: 4,
    sliceY: 3,
    anims: {
      search: { from: 0, to: 3, speed: 6, loop: true },
      snif: { from: 4, to: 5, speed: 4, loop: true },
      detect: 6,
      jump: { from: 7, to: 8, speed: 6 },
      catch: 9,
      mock: { from: 10, to: 11, loop: true },
    },
  });
  k.loadSprite("duck", "./graphics/duck.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
      "flight-diagonal": { from: 0, to: 2, loop: true },
      "flight-side": { from: 3, to: 5, loop: true },
      shot: 6,
      fall: 7,
    },
  });
  k.loadSprite("text-box", "./graphics/text-box.png");
  k.loadSprite("long-text-box", "./graphics/long-text-box.png");
  k.loadSound("gun-shot", "./sounds/gun-shot.wav");
  k.loadSound("quacking", "./sounds/quacking.wav");
  k.loadSound("flapping", "./sounds/flapping.ogg");
  k.loadSound("fall", "./sounds/fall.wav");
  k.loadSound("impact", "./sounds/impact.wav");
  k.loadSound("sniffing", "./sounds/sniffing.wav");
  k.loadSound("barking", "./sounds/barking.wav");
  k.loadSound("laughing", "./sounds/laughing.wav");
  k.loadSound("ui-appear", "./sounds/ui-appear.wav");
  k.loadSound("successful-hunt", "./sounds/successful-hunt.wav");
  k.loadSound("forest-ambiance", "./sounds/forest-ambiance.wav");
}