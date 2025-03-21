import gameManager from "../gameManager";
import { COLORS } from "../constants";
import k from "../kaplayCtx";
 
export default class Duck {
  #timer = 0;
  #timeBeforeEscape = 5;
 
  constructor(id, speed) {
    this.speed = speed;
    this.id = id;
 
    // Standard values that could appear
    const standardValues = [
      { decimal: 1.5, fraction: "1 1/2" },
      { decimal: 2.5, fraction: "2 1/2" },
      { decimal: 3.5, fraction: "3 1/2" },
      { decimal: 4.5, fraction: "4 1/2" },
      { decimal: -1.5, fraction: "-1 1/2" },
      { decimal: -2.5, fraction: "-2 1/2" },
    ];
 
    // Additional helpful values for when player is close to goal
    const helpfulPositiveValues = [
      { decimal: 0.5, fraction: "1/2" },
      { decimal: 1.0, fraction: "1" },
      { decimal: 2.0, fraction: "2" },
      { decimal: 3.0, fraction: "3" },
    ];
 
    const helpfulNegativeValues = [
      { decimal: -0.5, fraction: "-1/2" },
      { decimal: -1.0, fraction: "-1" },
      { decimal: -2.0, fraction: "-2" },
      { decimal: -3.0, fraction: "-3" },
    ];
 
    let chosenValue;
    let currentDifference;
 
    if (gameManager.gameMode === "pvp") {
      // For PVP mode, use the current player's measure
      currentDifference = gameManager.goalMeasure - gameManager.getCurrentPlayerMeasure();
    } else {
      // For solo mode, use the regular currentMeasure
      currentDifference = gameManager.goalMeasure - gameManager.currentMeasure;
    }
 
    // Check if the player is within ±5 of the goal
    if (Math.abs(currentDifference) <= 5) {
      // Player is close to the goal, let's help them
      const needsPositive = currentDifference > 0;
      const needsNegative = currentDifference < 0;
 
      // 70% chance to give helpful values, 30% chance for standard values
      if (k.randi(10) < 7) {
        if (needsPositive) {
          // We need positive values to reach the goal
          const helpfulValues = helpfulPositiveValues.filter(v => v.decimal <= currentDifference + 0.5);
          chosenValue = helpfulValues.length > 0 ?
            k.choose(helpfulValues) :
            k.choose(standardValues.filter(v => v.decimal > 0));
        }
        else if (needsNegative) {
          // We need negative values to reach the goal
          const helpfulValues = helpfulNegativeValues.filter(v => v.decimal >= currentDifference - 0.5);
          chosenValue = helpfulValues.length > 0 ?
            k.choose(helpfulValues) :
            k.choose(standardValues.filter(v => v.decimal < 0));
        }
        else {
          // Player is exactly at the goal, give them small values
          chosenValue = k.choose([
            { decimal: 0.5, fraction: "1/2" },
            { decimal: -0.5, fraction: "-1/2" }
          ]);
        }
      } else {
        // 30% chance to still get a standard value
        chosenValue = k.choose(standardValues);
      }
    } else {
      // Player is not close to the goal, use standard random values
      chosenValue = k.choose(standardValues);
    }
 
    this.value = chosenValue.decimal; // Use decimal for calculations
    this.displayValue = chosenValue.fraction;
 
    const startingPos = [
      k.vec2(80, k.center().y + 40),
      k.vec2(k.center().x, k.center().y + 40),
      k.vec2(200, k.center().y + 40),
    ];
 
    const angles = [k.vec2(-1, -1), k.vec2(1, -1), k.vec2(1, -1)];
 
    const chosenPosIndex = k.randi(startingPos.length);
    const chosenAngleIndex = k.randi(angles.length);
 
    this.gameObj = k.add([
      k.sprite("duck", { anim: "flight-side" }),
      k.area({ shape: new k.Rect(k.vec2(0), 24, 24) }),
      k.body(),
      k.anchor("center"),
      k.pos(startingPos[chosenPosIndex]),
      k.state("fly", ["fly", "shot", "fall"]),
      k.timer(),
      k.offscreen({ destroy: true, distance: 100 }),
    ]);
 
    this.valueText = k.add([
      k.text(this.displayValue, { font: "nes", size: 5 }),
      k.pos(this.gameObj.pos.x, this.gameObj.pos.y + 20), // Position it below the duck
      k.anchor("center"),
      "duckValueText" // Add a tag for easy access
    ]);
 
    this.angle = angles[chosenAngleIndex];
    // make duck face the correct direction
    if (this.angle.x < 0) this.gameObj.flipX = true;
 
    this.flappingSound = k.play("flapping", { loop: true, speed: 2 });
  }
 
  setBehavior() {
    this.gameObj.onStateUpdate("fly", () => {
      if (
        this.#timer < this.#timeBeforeEscape &&
        (this.gameObj.pos.x > k.width() + 10 || this.gameObj.pos.x < -10)
      ) {
        this.angle.x = -this.angle.x;
        this.angle.y = this.angle.y;
        this.gameObj.flipX = !this.gameObj.flipX;
 
        const currentAnim =
          this.gameObj.getCurAnim().name === "flight-side"
            ? "flight-diagonal"
            : "flight-side";
        this.gameObj.play(currentAnim);
      }
 
      if (this.gameObj.pos.y < -10 || this.gameObj.pos.y > k.height() - 70) {
        this.angle.y = -this.angle.y;
 
        const currentAnim =
          this.gameObj.getCurAnim().name === "flight-side"
            ? "flight-diagonal"
            : "flight-side";
        this.gameObj.play(currentAnim);
      }
      this.valueText.pos = this.gameObj.pos.add(0, 20);
      this.gameObj.move(k.vec2(this.angle).scale(this.speed));
    });
 
    this.gameObj.onStateEnter("shot", async () => {
      gameManager.nbDucksShotInRound++;
      this.gameObj.play("shot");
      this.flappingSound.stop();
      await k.wait(0.2);
      this.gameObj.enterState("fall");
    });
 
    this.gameObj.onStateEnter("fall", () => {
      this.fallSound = k.play("fall", { volume: 0.7 });
      this.gameObj.play("fall");
      k.destroy(this.valueText);
    });
 
    this.gameObj.onStateUpdate("fall", async () => {
      this.gameObj.move(0, this.speed);
 
      if (this.gameObj.pos.y > k.height() - 70) {
        this.fallSound.stop();
        k.play("impact");
        k.destroy(this.gameObj);
        delete this; // Destroy the Duck instance
        const sky = k.get("sky")[0];
        if (sky) sky.color = k.Color.fromHex(COLORS.BLUE);
        await k.wait(1);
        gameManager.stateMachine.enterState("duck-hunted");
      }
    });
 
    this.gameObj.onClick(() => {
      if (gameManager.nbBulletsLeft < 0) return;
    
      // Score tracking (only relevant in solo mode)
      if (gameManager.gameMode === "solo") {
        gameManager.currentScore += 100;
        gameManager.currentMeasure += this.value; // Update solo mode measure
    
        // Update the display for current measure
        const measureTextObj = k.get("measureText")[0];
        if (measureTextObj) {
          measureTextObj.text = gameManager.currentMeasure.toFixed(1);
        }
      } else {
        // PVP mode - update current player's measure
        gameManager.updateCurrentPlayerMeasure(this.value);
    
        // Update display for both players
        const p1MeasureText = k.get("p1MeasureText")[0];
        const p2MeasureText = k.get("p2MeasureText")[0];
    
        if (p1MeasureText) {
          p1MeasureText.text = gameManager.p1Measure.toFixed(1);
        }
        if (p2MeasureText) {
          p2MeasureText.text = gameManager.p2Measure.toFixed(1);
        }
      }
    
      this.gameObj.play("shot");
      const duckIcon = k.get(`duckIcon-${this.id}`, { recursive: true })[0];
      if (duckIcon) duckIcon.color = k.Color.fromHex(COLORS.RED);
      this.gameObj.enterState("shot");
    });
 
    const sky = k.get("sky")[0];
    this.gameObj.loop(1, () => {
      this.#timer += 1;
 
      if (this.#timer === this.#timeBeforeEscape) {
        if (sky) sky.color = k.Color.fromHex(COLORS.BEIGE);
      }
    });
 
    this.gameObj.onExitScreen(() => {
      this.flappingSound.stop();
      const sky = k.get("sky")[0];
      if (sky) sky.color = k.Color.fromHex(COLORS.BLUE);
      delete this; // Destroy the Duck instance
      gameManager.nbBulletsLeft = 3;
      gameManager.stateMachine.enterState("duck-escaped");
    });
  }
}