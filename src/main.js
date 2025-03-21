import { loadAssets } from "./assetLoader";
import { COLORS } from "./constants";
import Dog from "./entities/dog";
import Duck from "./entities/duck";
import k from "./kaplayCtx";
import gameManager from "./gameManager";
import formatScore from "./utils";

loadAssets();
const MAX_ROUNDS = 5;

// Set up the main-menu scene
k.scene("main-menu", () => {
  k.add([k.sprite("menu")]);

  k.add([
    k.text("CLICK TO START", { font: "nes", size: 8 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 40),
  ]);

  k.add([
    k.text("MADE BY TEAM MATH-HEW", { font: "nes", size: 8 }),
    k.z(2),
    k.pos(10, 215),
    k.color(COLORS.BLUE),
    k.opacity(0.5),
  ]);

  let bestScore = k.getData("best-score");
  if (!bestScore) {
    bestScore = 0;
    k.setData("best-score", 0);
  }
  k.add([
    k.text(formatScore(bestScore, 6), { font: "nes", size: 8 }),
    k.pos(150, 184),
    k.color(COLORS.RED),
  ]);

  k.onClick(() => {
    k.go("choose-mode"); // Go to mode selection instead of directly to game
  });
});

// Set up the choose-mode scene
k.scene("choose-mode", () => {
  // Add choose mode background
  k.add([k.sprite("choosemode")]);

  // Add title
  k.add([
    k.text("SELECT GAME MODE", { font: "nes", size: 10 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 50),
    k.color(COLORS.BLUE),
  ]);

  // Solo mode button
  const soloBtn = k.add([
    k.rect(120, 40),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y),
    k.color(COLORS.RED),
    k.area(),
    "solo-btn"
  ]);

  soloBtn.add([
    k.text("SOLO MODE", { font: "nes", size: 8 }),
    k.anchor("center"),
    k.color(COLORS.WHITE),
  ]);

  // PVP mode button
  const pvpBtn = k.add([
    k.rect(120, 40),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 60),
    k.color(COLORS.BLUE),
    k.area(),
    "pvp-btn"
  ]);

  pvpBtn.add([
    k.text("PVP MODE", { font: "nes", size: 8 }),
    k.anchor("center"),
    k.color(COLORS.WHITE),
  ]);

  // Handle button clicks
  k.onClick("solo-btn", () => {
    gameManager.gameMode = "solo";
    k.go("game");
  });

  k.onClick("pvp-btn", () => {
    gameManager.gameMode = "pvp";
    gameManager.currentPlayer = 1; // Start with player 1
    k.go("game");
  });
});

// Set up the game scene
k.scene("game", () => {
  k.setCursor("none");

  // Use different background based on game mode
  if (gameManager.gameMode === "pvp") {
    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("backgroundpvp"), k.pos(0, -10), k.z(1)]);
  } else {
    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("background"), k.pos(0, -10), k.z(1)]);
  }

  // Add score display only in solo mode
  let score;
  if (gameManager.gameMode === "solo") {
    score = k.add([
      k.text(formatScore(0, 6), { font: "nes", size: 8 }),
      k.pos(192, 197),
      k.z(2),
    ]);
  }

  // Display round count based on game mode
  let roundCount;
  if (gameManager.gameMode === "solo") {
    roundCount = k.add([
      k.text("1", { font: "nes", size: 8 }),
      k.pos(42, 182),
      k.z(2),
      k.color(COLORS.RED),
    ]);
  } else {

    const turnText = k.add([
      k.text("TURN:", { font: "nes", size: 5 }),
      k.pos(193, 202),
      k.z(2),
      k.color(COLORS.WHITE),
      "turnText"
    ]);

    // Display current player in PVP mode
    const currentPlayerText = k.add([
      k.text("P1", { font: "nes", size: 8 }),
      k.pos(220, 200), // Position current player text at the right place
      k.z(2),
      k.color(COLORS.RED),
      "currentPlayerText"
    ]);

    // Add fixed round text for PVP mode
    roundCount = k.add([
      k.text("1", { font: "nes", size: 8 }),
      k.pos(42, 182),
      k.z(2),
      k.color(COLORS.RED),
    ]);
  }

  // Goals display
  let goalText;
  if (gameManager.gameMode === "solo") {
    // Single goal text for solo mode
    goalText = k.add([
      k.text("", { font: "nes", size: 6 }),
      k.pos(140, 202),
      k.z(2),
      "goalText"
    ]);

    // Initialize current measure text for solo mode
    const measureText = k.add([
      k.text("0.0", { font: "nes", size: 6 }),
      k.pos(105, 202), // Adjust position as needed
      k.z(2),
      "measureText"
    ]);
  } else if (gameManager.gameMode === "pvp") {
    // Single goal text for PVP mode
    goalText = k.add([
      k.text("", { font: "nes", size: 6 }),
      k.pos(140, 202),
      k.z(2),
      "goalText"
    ]);

    // Initialize player measure texts for PVP mode
    const p1MeasureText = k.add([
      k.text("0.0", { font: "nes", size: 5 }),
      k.pos(105, 199), // Adjust position as needed
      k.z(2),
      k.color(COLORS.RED),
      "p1MeasureText"
    ]);

    const p2MeasureText = k.add([
      k.text("0.0", { font: "nes", size: 5 }),
      k.pos(105, 207), // Adjust position as needed
      k.z(2),
      k.color(COLORS.BLUE),
      "p2MeasureText"
    ]);
  }

  const duckIcons = k.add([k.pos(95, 198)]);
  let duckIconPosX = 1;
  for (let i = 0; i < 10; i++) {
    duckIcons.add([k.rect(7, 9), k.pos(duckIconPosX, 0), `duckIcon-${i}`]);
    duckIconPosX += 8;
  }

  const bulletUIMask = k.add([
    k.rect(0, 8),
    k.pos(25, 198),
    k.z(2),
    k.color(0, 0, 0),
  ]);

  const gameInstructions = k.add([
    k.sprite("long-text-box"),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 50),
    k.z(2),
  ]);

  if (gameManager.gameMode === "solo") {
    gameInstructions.add([
      k.text("SHOOT THE RULERS TO REACH THE GOAL!", { font: "nes", size: 5 }),
      k.anchor("center"),
      k.pos(0, -10),
    ]);
    gameInstructions.add([
      k.text("AVOID GOING NEGATIVE OR OVERSHOOTING!", { font: "nes", size: 5 }),
      k.anchor("center"),
      k.pos(0, 0),
    ]);
    gameInstructions.add([
      k.text("EARN BONUS POINTS FOR FEWER MOVES!", { font: "nes", size: 5 }),
      k.anchor("center"),
      k.pos(0, 10),
    ]);
  } else {
    gameInstructions.add([
      k.text("PVP MODE: TAKE TURNS SHOOTING RULERS!", { font: "nes", size: 5 }),
      k.anchor("center"),
      k.pos(0, -10),
    ]);
    gameInstructions.add([
      k.text("FIRST PLAYER TO REACH THE GOAL WINS!", { font: "nes", size: 5 }),
      k.anchor("center"),
      k.pos(0, 0),
    ]);
    gameInstructions.add([
      k.text("RED: PLAYER 1 | BLUE: PLAYER 2", { font: "nes", size: 5 }),
      k.anchor("center"),
      k.pos(0, 10),
    ]);
  }

  let dog;
  k.wait(7, () => {
    k.destroy(gameInstructions);
    dog = new Dog(k.vec2(0, k.center().y));
    dog.searchForDucks();
  });

  const roundStartController = gameManager.stateMachine.onStateEnter(
    "round-start",
    async (isFirstRound) => {
      if (gameManager.gameMode === "solo" && gameManager.currentRoundNb >= MAX_ROUNDS) {
        k.go("game-over");
        return;
      }
  
      if (!isFirstRound && gameManager.gameMode === "solo") {
        gameManager.preySpeed += 50;
      }
  
      k.play("ui-appear");
  
      if (gameManager.gameMode === "solo") {
        gameManager.currentRoundNb++;
        var measure = k.choose([20.0, 22.5, 15.0, 17.5, 25.0]);
        gameManager.goalMeasure = measure; // Set the goal for solo mode
        roundCount.text = gameManager.currentRoundNb;
        const goalTextObj = k.get("goalText")[0];
        if (goalTextObj) goalTextObj.text = gameManager.goalMeasure.toFixed(1) + "cm";
      } else {
        // PVP mode - set the same goal for both players
        var measure = k.choose([20.0, 22.5, 15.0, 17.5, 25.0]);
        gameManager.goalMeasure = measure;
  
        // Set the goal text just like in solo mode
        const goalTextObj = k.get("goalText")[0];
        if (goalTextObj) goalTextObj.text = gameManager.goalMeasure.toFixed(1) + "cm";
  
        // Reset player measures
        gameManager.p1Measure = 0;
        gameManager.p2Measure = 0;
  
        // Set current player to player 1 at start
        gameManager.currentPlayer = 1;
        const playerText = k.get("currentPlayerText")[0];
        if (playerText) {
          playerText.text = "P1";
          playerText.color = k.Color.fromHex(COLORS.RED);
        }
      }
  
      gameManager.currentMeasure = 0;
      const measureTextObj = k.get("measureText")[0];
      if (measureTextObj) measureTextObj.text = gameManager.currentMeasure.toFixed(1);
  
      const textBox = k.add([
        k.sprite("text-box"),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 50),
        k.z(2),
      ]);
  
      if (gameManager.gameMode === "solo") {
        textBox.add([
          k.text("ROUND", { font: "nes", size: 8 }),
          k.anchor("center"),
          k.pos(0, -10),
        ]);
        textBox.add([
          k.text(gameManager.currentRoundNb, { font: "nes", size: 8 }),
          k.anchor("center"),
          k.pos(0, 4),
        ]);
      } else {
        textBox.add([
          k.text("PVP MODE", { font: "nes", size: 8 }),
          k.anchor("center"),
          k.pos(0, -10),
        ]);
        textBox.add([
          k.text("BEGIN!", { font: "nes", size: 8 }),
          k.anchor("center"),
          k.pos(0, 4),
        ]);
      }
  
      await k.wait(1);
      k.destroy(textBox);
      gameManager.stateMachine.enterState("hunt-start");
    }
  );

  const roundEndController = gameManager.stateMachine.onStateEnter(
    "round-end",
    () => {
      if (gameManager.gameMode === "solo") {
        // Solo mode game over conditions
        if (gameManager.currentMeasure < 0 ||
            gameManager.currentMeasure > 2 * gameManager.goalMeasure) {
            var finalScore = gameManager.currentScore;
            k.go("game-over", { score: finalScore });
          return;
        }
    
        // Check if all rounds are completed
        if (gameManager.currentRoundNb >= MAX_ROUNDS) {
          var finalScore = gameManager.currentScore;
          k.go("game-over", { score: finalScore });
          return;
        }
    
        // If the round is valid, check for score updates
        if (gameManager.currentHuntNb < 15) {
          gameManager.currentScore += 500; // Plus points if the goal was reached in less than 15 tries
        }
    
        // Reset for the next round
        gameManager.currentHuntNb = 0;
        for (const duckIcon of duckIcons.children) {
          duckIcon.color = k.color(255, 255, 255); // Reset duck icons
        }
        gameManager.stateMachine.enterState("round-start"); // Start the next round
      } else {
        // PVP mode - check if either player has reached the goal
        if (gameManager.p1Measure === gameManager.goalMeasure) {
          // Player 1 reached the goal exactly
          gameManager.pvpWinner = 1;
          k.go("game-over");
          return;
        } else if (gameManager.p2Measure === gameManager.goalMeasure) {
          // Player 2 reached the goal exactly
          gameManager.pvpWinner = 2;
          k.go("game-over");
          return;
        } 
    
        // Switch player for the next turn
        gameManager.currentPlayer = gameManager.currentPlayer === 1 ? 2 : 1;
        const playerText = k.get("currentPlayerText")[0];
        if (playerText) {
          playerText.text = gameManager.currentPlayer === 1 ? "P1" : "P2";
          playerText.color = gameManager.currentPlayer === 1 ?
            k.Color.fromHex(COLORS.RED) : k.Color.fromHex(COLORS.BLUE);
        }
    
        // Update player measures display
        const p1MeasureText = k.get("p1MeasureText")[0];
        const p2MeasureText = k.get("p2MeasureText")[0];
    
        if (p1MeasureText) {
          p1MeasureText.text = gameManager.p1Measure.toFixed(1);
        }
        if (p2MeasureText) {
          p2MeasureText.text = gameManager.p2Measure.toFixed(1);
        }
    
        // Reset for the next turn
        gameManager.currentHuntNb = 0;
        for (const duckIcon of duckIcons.children) {
          duckIcon.color = k.color(255, 255, 255); // Reset duck icons
        }
        gameManager.stateMachine.enterState("hunt-start");
      }
    }
  );

let currentDuck;
  const huntStartController = gameManager.stateMachine.onStateEnter(
    "hunt-start",
    () => {
      gameManager.currentHuntNb++;
      currentDuck  = new Duck(
        gameManager.currentHuntNb - 1,
        gameManager.preySpeed
      );
      currentDuck .setBehavior();
    }
  );

  const huntEndController = gameManager.stateMachine.onStateEnter(
    "hunt-end",
    () => {
      if (gameManager.gameMode === "solo") {
        const bestScore = Number(k.getData("best-score"));
  
        // Update best score if current score is higher
        if (bestScore < gameManager.currentScore) {
          k.setData("best-score", gameManager.currentScore);
        }
  
        // Check if the current measure meets the goal measure
        if (gameManager.currentMeasure === gameManager.goalMeasure ||
            gameManager.currentMeasure < 0 ||
            gameManager.currentMeasure > 2 * gameManager.goalMeasure) {
  
          // Reset for the next round
          gameManager.currentHuntNb = 0;
          gameManager.stateMachine.enterState("round-end");
        } else {
          // If the goal is not met, continue to the next hunt
          gameManager.stateMachine.enterState("hunt-start");
        }
      } else {
        // PVP Mode
        // Check if current player has reached the goal
        let currentMeasure = gameManager.currentPlayer === 1 ?
          gameManager.p1Measure : gameManager.p2Measure;
  
        if (currentMeasure >= gameManager.goalMeasure) {
          // Player has reached or exceeded the goal - set winner
          gameManager.pvpWinner = gameManager.currentPlayer;
          gameManager.currentHuntNb = 0;
          gameManager.stateMachine.enterState("round-end");
        } else {
          // Always switch turns after a player takes a shot in PVP mode
          gameManager.currentHuntNb = 0;
          gameManager.stateMachine.enterState("round-end");
        }
      }
    }
  );

  const duckHunterController = gameManager.stateMachine.onStateEnter(
    "duck-hunted",
    () => {
      gameManager.nbBulletsLeft = 3;
      dog.catchFallenDuck();
    }
  );

  const duckEscapedController = gameManager.stateMachine.onStateEnter(
    "duck-escaped",
    async () => {
      dog.mockPlayer();
    }
  );

  // Use different cursors based on game mode and current player
  let cursor;
  if (gameManager.gameMode === "pvp") {
    // Create cursor with appropriate cursor sprite based on current player
    cursor = k.add([
      k.sprite(gameManager.currentPlayer === 1 ? "cursor1" : "cursor2"),
      k.anchor("center"),
      k.pos(),
      k.z(3),
      "playerCursor"
    ]);
  } else {
    cursor = k.add([k.sprite("cursor"), k.anchor("center"), k.pos(), k.z(3)]);
  }

  k.onClick(() => {
    if (
      gameManager.stateMachine.state === "hunt-start" &&
      !gameManager.isGamePaused
    ) {
      if (gameManager.nbBulletsLeft > 0) k.play("gun-shot", { volume: 0.5 });
      gameManager.nbBulletsLeft--;
    }
  });

  k.onUpdate(() => {
    if (gameManager.gameMode === "solo" && score) {
      score.text = formatScore(gameManager.currentScore, 6);
    }

    // Update the cursor sprite on each frame based on current player
    if (gameManager.gameMode === "pvp") {
      const playerCursor = k.get("playerCursor")[0];
      if (playerCursor) {
        playerCursor.use(k.sprite(gameManager.currentPlayer === 1 ? "cursor1" : "cursor2"));
      }
    }

    switch (gameManager.nbBulletsLeft) {
      case 3:
        bulletUIMask.width = 0;
        break;
      case 2:
        bulletUIMask.width = 8;
        break;
      case 1:
        bulletUIMask.width = 15;
        break;
      default:
        bulletUIMask.width = 22;
    }
    cursor.moveTo(k.mousePos());
  });

  const forestAmbianceSound = k.play("forest-ambiance", {
    volume: 0.1,
    loop: true,
  });

  k.onSceneLeave(() => {
    forestAmbianceSound.stop();
    roundStartController.cancel();
    roundEndController.cancel();
    huntStartController.cancel();
    huntEndController.cancel();
    duckHunterController.cancel();
    duckEscapedController.cancel();
    gameManager.initializeGameState();
    k.setCursor("default");
  });

  const backButton = k.add([
    k.rect(40, 15),
    k.pos(10, 10),
    k.color(COLORS.GRAY),
    k.area(),
    k.z(1),
    k.opacity(0),
    "back-button"
  ]);
  
  const backButtonText = backButton.add([
    k.text("BACK", { font: "nes", size: 6 }),
    k.anchor("center"),
    k.pos(20, 7.5),
    k.color(COLORS.WHITE),
    k.opacity(0),
  ]);
  
  k.onClick("back-button", () => {
    if (currentDuck) {
      currentDuck.stopFlappingSound(); // Stop the flapping sound for the current duck
    }
    k.getTreeRoot().paused = !k.getTreeRoot().paused;
    audioCtx.resume();
    gameManager.isGamePaused = false;
    if (backButton.opacity > 0) {
      k.setCursor("default");
      k.go("main-menu"); // Go back to main menu
    }
  });

  k.onKeyPress((key) => {
    if (key === "p") {
      backButton.opacity = 1;
      backButtonText.opacity = 1;
      k.getTreeRoot().paused = !k.getTreeRoot().paused;
      if (k.getTreeRoot().paused) {
        gameManager.isGamePaused = true;
        audioCtx.suspend();
        k.setCursor("default");
        if (currentDuck) {
          currentDuck.stopFlappingSound(); // Stop the flapping sound for the current duck
        }
        k.add([k.text("PAUSED", { font: "nes", size: 8 }), k.pos(5, 5), k.z(3), "paused-text"]);
      } else {
        gameManager.isGamePaused = false;
        audioCtx.resume();
        k.setCursor(gameManager.currentPlayer === 1 ? "cursor1" : "cursor2"); // Restore game cursor
        backButton.opacity = 0;
        backButtonText.opacity = 0;
        const pausedText = k.get("paused-text")[0];
        if (pausedText) k.destroy(pausedText);
      }
    }
  });
});

// Set up game-over scene
k.scene("game-over", (params = { score: 0 }) => {
  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);

  if (gameManager.gameMode === "pvp") {
    // Display the winner in PVP mode
    k.add([
      k.text("PLAYER " + gameManager.currentPlayer + " WINS!", { font: "nes", size: 8 }),
      k.anchor("center"),
      k.pos(k.center()),
      k.color(gameManager.currentPlayer === 1 ? COLORS.RED : COLORS.BLUE)
    ]);
  } else {
    // Regular game over message for solo mode
    k.add([
      k.text("GAME OVER!", { font: "nes", size: 8 }),
      k.anchor("center"),
      k.pos(k.center()),
    ]);
    k.add([
      k.text("YOUR SCORE: " + params.score, { font: "nes", size: 7 }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 10),
    ]);

    // SUBMIT SOLO SCORE TO DATABASE HERE

  }

  k.wait(2, () => {
    k.go("main-menu");
  });
});

// Start the game at the main-menu scene
k.go("main-menu");