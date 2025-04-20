import gameManager from "../gameManager";
import { COLORS } from "../constants";
import k from "../kaplayCtx";

export default class Duck {
  #timer = 0;
  #timeBeforeEscape = 10; // Doubled from 5 to 10 seconds

  constructor(id, speed) {
    this.speed = speed;
    this.id = id;

    // Choose values based on lesson type and difficulty
    let standardValues = [];
    let helpfulValues = [];

    // For PVP mode, always use decimal values regardless of lesson type
    if (gameManager.gameMode === "pvp") {
      // Use the decimal type values for PVP mode
      if (gameManager.difficultyLevel === "beginner") {
        standardValues = [
          { decimal: 1.5, display: "1.5" },
          { decimal: 2.5, display: "2.5" },
          { decimal: 3.5, display: "3.5" },
          { decimal: 4.5, display: "4.5" },
          { decimal: -1.5, display: "-1.5" },
          { decimal: -2.5, display: "-2.5" },
          { decimal: 0.5, display: "0.5" },
          { decimal: 1.0, display: "1.0" },
          { decimal: 2.0, display: "2.0" },
          { decimal: 3.0, display: "3.0" },
        ];

        helpfulValues = [
          { decimal: 0.5, display: "0.5" },
          { decimal: 1.0, display: "1.0" },
          { decimal: -0.5, display: "-0.5" },
          { decimal: -1.0, display: "-1.0" },
        ];
      } else { // advanced
        standardValues = [
          { decimal: 1.5, display: "1.5" },
          { decimal: 2.5, display: "2.5" },
          { decimal: 3.5, display: "3.5" },
          { decimal: 4.5, display: "4.5" },
          { decimal: 2.25, display: "2.25" },
          { decimal: 3.75, display: "3.75" },
          { decimal: 4.25, display: "4.25" },
          { decimal: 0.25, display: "0.25" },
          { decimal: 0.75, display: "0.75" },
          { decimal: -1.5, display: "-1.5" },
          { decimal: -2.5, display: "-2.5" },
          { decimal: -0.75, display: "-0.75" },
          { decimal: -0.25, display: "-0.25" },
        ];

        helpfulValues = [
          { decimal: 0.25, display: "0.25" },
          { decimal: 0.5, display: "0.5" },
          { decimal: 0.75, display: "0.75" },
          { decimal: -0.25, display: "-0.25" },
          { decimal: -0.5, display: "-0.5" },
        ];
      }
    } else { // Solo mode - use the selected lesson type
      // Select appropriate duck values based on lesson type and difficulty
      if (gameManager.lessonType === "whole-numbers") {
        if (gameManager.difficultyLevel === "beginner") {
          standardValues = [
            { decimal: 1000, display: "1,000" },
            { decimal: 10000, display: "10,000" },
            { decimal: 100000, display: "100,000" },
            { decimal: 1000000, display: "1,000,000" },
            { decimal: 10000000, display: "10,000,000" },
            { decimal: 100000000, display: "100,000,000" },
            { decimal: -1000, display: "-1,000" },
            { decimal: -10000, display: "-10,000" },
          ];

          // Helpful values for beginners (whole numbers)
          helpfulValues = [
            { decimal: 500, display: "500" },
            { decimal: 1000, display: "1,000" },
            { decimal: 5000, display: "5,000" },
            { decimal: -500, display: "-500" },
          ];
        } else {
          // advanced
          standardValues = [
            { decimal: 1000, display: "1,000" },
            { decimal: 2000, display: "2,000" },
            { decimal: 5000, display: "5,000" },
            { decimal: 10000, display: "10,000" },
            { decimal: 50000, display: "50,000" },
            { decimal: 100000, display: "100,000" },
            { decimal: 200000, display: "200,000" },
            { decimal: 500000, display: "500,000" },
            { decimal: 1000000, display: "1,000,000" },
            { decimal: 10000000, display: "10,000,000" },
            { decimal: -1000, display: "-1,000" },
            { decimal: -2000, display: "-2,000" },
            { decimal: -5000, display: "-5,000" },
            { decimal: -50000, display: "-50,000" },
            { decimal: -200000, display: "-200,000" },
          ];

          // Helpful values for advanced (whole numbers)
          helpfulValues = [
            { decimal: 1000, display: "1,000" },
            { decimal: 5000, display: "5,000" },
            { decimal: 10000, display: "10,000" },
            { decimal: -1000, display: "-1,000" },
            { decimal: -5000, display: "-5,000" },
          ];
        }
      } else if (gameManager.lessonType === "fractions") {
        if (gameManager.difficultyLevel === "beginner") {
          standardValues = [
            { decimal: 1.5, display: "1 1/2" },
            { decimal: 2.5, display: "2 1/2" },
            { decimal: 3.5, display: "3 1/2" },
            { decimal: 4.5, display: "4 1/2" },
            { decimal: -1.5, display: "-1 1/2" },
            { decimal: -2.5, display: "-2 1/2" },
            { decimal: 0.5, display: "1/2" },
            { decimal: 0.25, display: "1/4" },
            { decimal: 0.75, display: "3/4" },
            { decimal: 1.25, display: "1 1/4" },
            { decimal: 1.75, display: "1 3/4" },
          ];

          // Helpful values (fractions beginner)
          helpfulValues = [
            { decimal: 0.25, display: "1/4" },
            { decimal: 0.5, display: "1/2" },
            { decimal: 0.75, display: "3/4" },
            { decimal: -0.25, display: "-1/4" },
            { decimal: -0.5, display: "-1/2" },
          ];
        } else {
          // advanced
          standardValues = [
            { decimal: 1.5, display: "1 1/2" },
            { decimal: 2.5, display: "2 1/2" },
            { decimal: 3.5, display: "3 1/2" },
            { decimal: 4.5, display: "4 1/2" },
            { decimal: 0.33, display: "1/3" },
            { decimal: 0.67, display: "2/3" },
            { decimal: 1.33, display: "1 1/3" },
            { decimal: 1.67, display: "1 2/3" },
            { decimal: 0.2, display: "1/5" },
            { decimal: 0.4, display: "2/5" },
            { decimal: 0.6, display: "3/5" },
            { decimal: 0.8, display: "4/5" },
            { decimal: -0.5, display: "-1/2" },
            { decimal: -1.5, display: "-1 1/2" },
            { decimal: -0.25, display: "-1/4" },
          ];

          // Helpful values (fractions advanced)
          helpfulValues = [
            { decimal: 0.2, display: "1/5" },
            { decimal: 0.25, display: "1/4" },
            { decimal: 0.33, display: "1/3" },
            { decimal: -0.2, display: "-1/5" },
            { decimal: -0.25, display: "-1/4" },
          ];
        }
      } else if (gameManager.lessonType === "measurements") {
        if (gameManager.difficultyLevel === "beginner") {
          standardValues = [
            { decimal: 1.5, display: "1.5cm" },
            { decimal: 2.5, display: "2.5cm" },
            { decimal: 3.5, display: "3.5cm" },
            { decimal: 4.5, display: "4.5cm" },
            { decimal: -1.5, display: "-1.5cm" },
            { decimal: -2.5, display: "-2.5cm" },
            { decimal: 0.5, display: "0.5cm" },
            { decimal: 1.0, display: "1.0cm" },
            { decimal: 2.0, display: "2.0cm" },
            { decimal: 3.0, display: "3.0cm" },
          ];

          // Helpful values (measurements beginner)
          helpfulValues = [
            { decimal: 0.5, display: "0.5cm" },
            { decimal: 1.0, display: "1.0cm" },
            { decimal: -0.5, display: "-0.5cm" },
            { decimal: -1.0, display: "-1.0cm" },
          ];
        } else {
          // advanced
          standardValues = [
            { decimal: 1.5, display: "1.5cm" },
            { decimal: 2.5, display: "2.5cm" },
            { decimal: 3.5, display: "3.5cm" },
            { decimal: 4.5, display: "4.5cm" },
            { decimal: 0.5, display: "0.5cm" },
            { decimal: 1.0, display: "1.0cm" },
            { decimal: 2.0, display: "2.0cm" },
            { decimal: 2.54, display: "1inch" },
            { decimal: 5.08, display: "2inch" },
            { decimal: 7.62, display: "3inch" },
            { decimal: -2.54, display: "-1inch" },
            { decimal: -5.08, display: "-2inch" },
            { decimal: -1.5, display: "-1.5cm" },
            { decimal: -2.5, display: "-2.5cm" },
          ];

          // Helpful values (measurements advanced)
          helpfulValues = [
            { decimal: 0.5, display: "0.5cm" },
            { decimal: 1.0, display: "1.0cm" },
            { decimal: 2.54, display: "1inch" },
            { decimal: -0.5, display: "-0.5cm" },
            { decimal: -1.0, display: "-1.0cm" },
          ];
        }
      } else {
        // decimals (default)
        if (gameManager.difficultyLevel === "beginner") {
          standardValues = [
            { decimal: 1.5, display: "1.5" },
            { decimal: 2.5, display: "2.5" },
            { decimal: 3.5, display: "3.5" },
            { decimal: 4.5, display: "4.5" },
            { decimal: -1.5, display: "-1.5" },
            { decimal: -2.5, display: "-2.5" },
            { decimal: 0.5, display: "0.5" },
            { decimal: 1.0, display: "1.0" },
            { decimal: 2.0, display: "2.0" },
            { decimal: 3.0, display: "3.0" },
          ];

          // Helpful values (decimals beginner)
          helpfulValues = [
            { decimal: 0.5, display: "0.5" },
            { decimal: 1.0, display: "1.0" },
            { decimal: -0.5, display: "-0.5" },
            { decimal: -1.0, display: "-1.0" },
          ];
        } else {
          // advanced
          standardValues = [
            { decimal: 1.5, display: "1.5" },
            { decimal: 2.5, display: "2.5" },
            { decimal: 3.5, display: "3.5" },
            { decimal: 4.5, display: "4.5" },
            { decimal: 2.25, display: "2.25" },
            { decimal: 3.75, display: "3.75" },
            { decimal: 4.25, display: "4.25" },
            { decimal: 0.25, display: "0.25" },
            { decimal: 0.75, display: "0.75" },
            { decimal: -1.5, display: "-1.5" },
            { decimal: -2.5, display: "-2.5" },
            { decimal: -0.75, display: "-0.75" },
            { decimal: -0.25, display: "-0.25" },
          ];

          // Helpful values (decimals advanced)
          helpfulValues = [
            { decimal: 0.25, display: "0.25" },
            { decimal: 0.5, display: "0.5" },
            { decimal: 0.75, display: "0.75" },
            { decimal: -0.25, display: "-0.25" },
            { decimal: -0.5, display: "-0.5" },
          ];
        }
      }
    }

    // Split standard values into positive and negative
    let positiveValues = standardValues.filter(v => v.decimal >= 0);
    let negativeValues = standardValues.filter(v => v.decimal < 0);

    // Choose a value based on how close we are to the goal measure
    let chosenValue;

    // Only in solo mode and after the first hunt
    if (gameManager.gameMode === "solo" && gameManager.currentHuntNb > 1) {
      // Calculate the difference between current measure and goal measure
      const difference = gameManager.goalMeasure - gameManager.currentMeasure;

      // If the difference is small (getting close to the goal), increase chance of helpful values
      // The closer to the goal, the higher the chance of getting helpful values
      let chanceOfHelpful = 0;

      if (gameManager.lessonType === "whole-numbers") {
        // For whole numbers, consider differences proportionally to their scale
        const percentDiff = Math.abs(difference / gameManager.goalMeasure);
        if (percentDiff < 0.05) chanceOfHelpful = 0.8; // Within 5% of goal
        else if (percentDiff < 0.1) chanceOfHelpful = 0.6; // Within 10% of goal
        else if (percentDiff < 0.2) chanceOfHelpful = 0.4; // Within 20% of goal
      } else {
        // For other types with smaller numbers
        if (Math.abs(difference) < 0.5) chanceOfHelpful = 0.8; // Within 0.5 of goal
        else if (Math.abs(difference) < 1.0) chanceOfHelpful = 0.6; // Within 1.0 of goal
        else if (Math.abs(difference) < 2.0) chanceOfHelpful = 0.4; // Within 2.0 of goal
      }

      // Based on the chance, decide whether to show a helpful value
      if (Math.random() < chanceOfHelpful && helpfulValues.length > 0) {
        // Find the most helpful value (closest to the difference)
        let bestHelpfulValue = helpfulValues[0];
        let bestDifference = Math.abs(difference - helpfulValues[0].decimal);

        for (let i = 1; i < helpfulValues.length; i++) {
          const currentDifference = Math.abs(difference - helpfulValues[i].decimal);
          if (currentDifference < bestDifference) {
            bestDifference = currentDifference;
            bestHelpfulValue = helpfulValues[i];
          }
        }

        chosenValue = bestHelpfulValue;
      } else {
        // Prevent consecutive negative ducks
        if (gameManager.lastDuckValue !== null && gameManager.lastDuckValue < 0) {
          // Previous duck was negative, so choose a positive value
          chosenValue = k.choose(positiveValues);
        } else {
          // Previous duck was positive or null, so choose from all values
          chosenValue = k.choose(standardValues);
        }
      }
    } else {
      // In PVP mode or first hunt
      // Prevent consecutive negative ducks
      if (gameManager.lastDuckValue !== null && gameManager.lastDuckValue < 0) {
        // Previous duck was negative, so choose a positive value
        chosenValue = k.choose(positiveValues);
      } else {
        // Previous duck was positive or null, so choose from all values
        chosenValue = k.choose(standardValues);
      }
    }

    // Use the chosen value
    this.value = chosenValue.decimal; // Use decimal for calculations
    this.displayValue = chosenValue.display;

    // Store the current value in gameManager for the next duck
    gameManager.lastDuckValue = this.value;

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
      k.offscreen({ destroy: true, distance: 200 }), // Doubled from 100 to 200
    ]);

    this.valueText = k.add([
      k.text(this.displayValue, { font: "nes", size: 5 }),
      k.pos(this.gameObj.pos.x, this.gameObj.pos.y + 20), // Position it below the duck
      k.anchor("center"),
      "duckValueText", // Add a tag for easy access
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

      // Double speed when escaping (after timeBeforeEscape)
      if (this.#timer >= this.#timeBeforeEscape) {
        // Move at double speed when escaping
        this.gameObj.move(k.vec2(this.angle).scale(this.speed * 2));
      } else {
        // Move at normal (slow) speed during regular gameplay
        this.gameObj.move(k.vec2(this.angle).scale(this.speed));
      }
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
      this.gameObj.move(0, this.speed * 2); // Speed up falling animation

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

        // Update the display for current measure immediately
        const measureTextObj = k.get("measureText")[0];
        if (measureTextObj) {
          // Format measure display based on lesson type to avoid displaying decimal temporarily
          if (gameManager.lessonType === "whole-numbers") {
            measureTextObj.text = Math.floor(gameManager.currentMeasure).toLocaleString();
          } else if (gameManager.lessonType === "fractions") {
            // Convert to fraction display for UI only
            const whole = Math.floor(gameManager.currentMeasure);
            const frac = gameManager.currentMeasure - whole;

            if (frac === 0) {
              measureTextObj.text = whole.toString();
            } else if (frac === 0.5) {
              measureTextObj.text = whole > 0 ? `${whole} 1/2` : "1/2";
            } else if (frac === 0.25) {
              measureTextObj.text = whole > 0 ? `${whole} 1/4` : "1/4";
            } else if (frac === 0.75) {
              measureTextObj.text = whole > 0 ? `${whole} 3/4` : "3/4";
            } else {
              measureTextObj.text = gameManager.currentMeasure.toString();
            }
          } else if (gameManager.lessonType === "measurements") {
            measureTextObj.text = gameManager.currentMeasure.toFixed(1);
          } else {
            // decimals
            measureTextObj.text = gameManager.currentMeasure.toFixed(1);
          }
        }

        // Update progress indicators immediately
        if (gameManager.lessonType === "fractions") {
          // Update pie chart for fractions
          const pieProgress = k.get("fraction-progress")[0];
          if (pieProgress) {
            let progress = Math.min(gameManager.currentMeasure / gameManager.goalMeasure, 1);
            const frameIndex = Math.min(Math.floor(progress * 8), 7);
            pieProgress.play(`fill-${frameIndex}`);
          }
        } else {
          // Update progress segments for other lesson types
          const segmentTag = `${gameManager.lessonType}-progress-segment`;
          const segments = k.get(segmentTag);
          if (segments && segments.length > 0) {
            let progress = Math.min(gameManager.currentMeasure / gameManager.goalMeasure, 1);
            const segmentsToReveal = Math.floor(progress * 8);

            for (let i = 0; i < 8; i++) {
              if (i < segmentsToReveal && segments[i]) {
                segments[i].opacity = 0;
              }
            }
          }
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
  stopFlappingSound() {
    if (this.flappingSound) {
      this.flappingSound.stop();
    }
  }
}