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

  // Use different background based on game mode and lesson type
  if (gameManager.gameMode === "pvp") {
    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("backgroundpvp"), k.pos(0, -10), k.z(1)]);
  } else {
    // Solo mode - use background based on lesson type
    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    
    // Get the appropriate background sprite based on lesson type
    const backgroundSprite = gameManager.getBackgroundSprite();
    k.add([k.sprite(backgroundSprite), k.pos(0, -10), k.z(1)]);
    
    // Add a visual indicator of the current lesson type
    k.add([
      k.text(gameManager.lessonType.toUpperCase(), { font: "nes", size: 4 }),
      k.pos(5, 5),
      k.color(COLORS.WHITE),
      k.opacity(0.7),
    ]);
  }

  // Add pause button - positioned 6px from top (4px up) and 5px from right (5px to the right)
  const pauseButton = k.add([
    k.sprite("pausebutton"),
    k.pos(k.width() - 21, 6), // Adjusted from (k.width() - 26, 10) to (k.width() - 21, 6)
    k.area(),
    k.z(10), // High z-index to ensure it's always visible
    "pause-button"
  ]);

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
  let measureText;
  let progressSegments = [];
  
  if (gameManager.gameMode === "solo") {
    if (gameManager.lessonType === "whole-numbers") {
      // For whole numbers, position values above and below each other
      // Increase font size by 1 (from 4 to 5) and move down 1 pixel
      const fontSize = 5; // Increased from 4
      
      // Current measure on top, move down 1 more pixel
      measureText = k.add([
        k.text("0", { font: "nes", size: fontSize }),
        k.pos(120, 206), // Shifted down 1 more pixel (from 205 to 206)
        k.z(2),
        "measureText"
      ]);
      
      // Goal measure below, also move down 1 more pixel
      goalText = k.add([
        k.text("", { font: "nes", size: fontSize }),
        k.pos(120, 215), // Shifted down 1 more pixel (from 214 to 215)
        k.z(2),
        "goalText"
      ]);
      
      // Add progress bar for whole numbers, measurements and decimals
      if (gameManager.lessonType !== "fractions") {
        // Create 8 black progress sprites to cover the progress bar
        const startX = 112;
        const startY = 196; // Moved 3 pixels up from 199 to 196
        const segmentSpacing = 7; // Each sprite is 8x7 pixels, but we'll overlap slightly
        
        // Tag the progress segments with a unique ID that includes lesson type
        const segmentTag = `${gameManager.lessonType}-progress-segment`;
        
        for (let i = 0; i < 8; i++) {
          const segment = k.add([
            k.sprite("blackprogress"),
            k.pos(startX + (i * segmentSpacing), startY),
            k.z(2),
            segmentTag,
            `segment-${i}`
          ]);
          progressSegments.push(segment);
        }
      }
    } else {
      // For other lesson types, keep side by side but shift up 1px (from previous 10px shift down)
      const fontSize = 6;
      
      if (gameManager.lessonType === "fractions") {
        // For fractions, move the goal text 5 pixels to the right
        goalText = k.add([
          k.text("", { font: "nes", size: fontSize }),
          k.pos(145, 211), // Moved 5 pixels right from 140 to 145
          k.z(2),
          "goalText"
        ]);
      } else {
        goalText = k.add([
          k.text("", { font: "nes", size: fontSize }),
          k.pos(140, 211), // Unchanged for other lesson types
          k.z(2),
          "goalText"
        ]);
      }

      // Initialize current measure text for solo mode
      measureText = k.add([
        k.text("0", { font: "nes", size: fontSize }),
        k.pos(105, 211), // Unchanged
        k.z(2),
        "measureText"
      ]);
      
      // Add progress visualization based on lesson type
      if (gameManager.lessonType === "fractions") {
        // For fractions, use the pie chart sprite
        // Shifted 2 more pixels up from previous position (113, 175)
        const pieProgress = k.add([
          k.sprite("pie", { anim: "fill-0" }), // Start with empty pie (0/8 filled)
          k.pos(113, 173), // New position: (113, 175-2) = (113, 173)
          k.z(2),
          "fraction-progress"
        ]);
      } else {
        // For measurements and decimals types, use the black progress sprites
        // Create 8 black progress sprites to cover the progress bar
        const startX = 112;
        const startY = 196; // Moved 3 pixels up from 199 to 196
        const segmentSpacing = 7; // Each sprite is 8x7 pixels, but we'll overlap slightly
        
        // Tag the progress segments with a unique ID that includes lesson type
        const segmentTag = `${gameManager.lessonType}-progress-segment`;
        
        for (let i = 0; i < 8; i++) {
          const segment = k.add([
            k.sprite("blackprogress"),
            k.pos(startX + (i * segmentSpacing), startY),
            k.z(2),
            segmentTag,
            `segment-${i}`
          ]);
          progressSegments.push(segment);
        }
      }
    }
  } else if (gameManager.gameMode === "pvp") {
    // PVP mode always shows goal and measure texts
    const goalText = k.add([
      k.text("", { font: "nes", size: 6 }),
      k.pos(140, 202),
      k.z(2),
      "goalText"
    ]);

    // Initialize player measure texts for PVP mode
    const p1MeasureText = k.add([
      k.text("0.0", { font: "nes", size: 5 }),
      k.pos(105, 199),
      k.z(2),
      k.color(COLORS.RED),
      "p1MeasureText"
    ]);

    const p2MeasureText = k.add([
      k.text("0.0", { font: "nes", size: 5 }),
      k.pos(105, 207),
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
        
        // Reset progress indicators for all lesson types
        if (gameManager.lessonType === "fractions") {
          // Reset pie chart to empty (frame 0)
          const pieProgress = k.get("fraction-progress")[0];
          if (pieProgress) {
            pieProgress.play("fill-0");
          }
        } else {
          // Reset black progress segments for other lesson types
          const segmentTag = `${gameManager.lessonType}-progress-segment`;
          const segments = k.get(segmentTag);
          if (segments && segments.length > 0) {
            segments.forEach(segment => {
              segment.opacity = 1; // Make all segments visible again
            });
          }
        }
        
        // Set appropriate goal values based on lesson type
        let goalValues;
        
        switch(gameManager.lessonType) {
          case "whole-numbers":
            goalValues = gameManager.difficultyLevel === "beginner" 
              ? [10000, 50000, 100000, 200000, 500000] 
              : [1000000, 2000000, 5000000, 10000000, 50000000];
            break;
          case "fractions":
            goalValues = gameManager.difficultyLevel === "beginner"
              ? [5.0, 7.5, 10.0, 12.5, 15.0]  // Equivalent to 5, 7 1/2, 10, 12 1/2, 15
              : [7.5, 10.0, 12.5, 15.0, 20.0]; // Displayed as fractions in UI
            break;
          case "measurements":
            goalValues = gameManager.difficultyLevel === "beginner"
              ? [15.0, 17.5, 20.0, 22.5, 25.0] 
              : [20.0, 25.4, 30.0, 35.0, 40.0]; // 25.4 = 10 inches
            break;
          case "decimals":
          default:
            goalValues = gameManager.difficultyLevel === "beginner"
              ? [15.0, 17.5, 20.0, 22.5, 25.0] 
              : [17.5, 20.0, 22.5, 25.0, 27.5];
        }
        
        // Choose a random goal from the values
        var measure = k.choose(goalValues);
        gameManager.goalMeasure = measure; // Set the goal for solo mode
        
        roundCount.text = gameManager.currentRoundNb;
        const goalTextObj = k.get("goalText")[0];
        if (goalTextObj) {
          // Format goal display based on lesson type
          if (gameManager.lessonType === "whole-numbers") {
            // Format with commas
            goalTextObj.text = gameManager.goalMeasure.toLocaleString();
          } else if (gameManager.lessonType === "fractions") {
            // Convert to fraction display for UI only
            // This is a simplified conversion - in a real game you might want more precise fraction display
            const whole = Math.floor(gameManager.goalMeasure);
            const frac = gameManager.goalMeasure - whole;
            
            if (frac === 0) {
              goalTextObj.text = whole.toString();
            } else if (frac === 0.5) {
              goalTextObj.text = whole > 0 ? `${whole} 1/2` : "1/2";
            } else if (frac === 0.25) {
              goalTextObj.text = whole > 0 ? `${whole} 1/4` : "1/4";
            } else if (frac === 0.75) {
              goalTextObj.text = whole > 0 ? `${whole} 3/4` : "3/4";
            } else {
              goalTextObj.text = gameManager.goalMeasure.toString();
            }
          } else if (gameManager.lessonType === "measurements") {
            goalTextObj.text = gameManager.goalMeasure.toFixed(1) + "cm";
          } else { // decimals
            goalTextObj.text = gameManager.goalMeasure.toFixed(1);
          }
        }
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
      if (measureTextObj) {
        // Format measure display based on lesson type
        if (gameManager.lessonType === "whole-numbers") {
          measureTextObj.text = "0";
        } else if (gameManager.lessonType === "fractions") {
          measureTextObj.text = "0";
        } else if (gameManager.lessonType === "measurements") {
          measureTextObj.text = "0.0"; // Remove cm from current measure
        } else { // decimals
          measureTextObj.text = "0.0";
        }
      }
  
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
      
      // Create a single duck with even slower speed (1/4 of original speed)
      // This combined with the doubled time before escape will give ~4x total time on screen
      currentDuck = new Duck(
        gameManager.currentHuntNb - 1,
        gameManager.preySpeed / 4 // Reduced from /2 to /4 for even slower movement
      );
      currentDuck.setBehavior();
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
  
        // Check if the current measure exactly matches the goal measure
        // Changed back to exact match
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
        // Check if current player has reached the goal exactly
        let currentMeasure = gameManager.currentPlayer === 1 ?
          gameManager.p1Measure : gameManager.p2Measure;
  
        if (currentMeasure === gameManager.goalMeasure) {
          // Player has reached the goal exactly - set winner
          gameManager.pvpWinner = gameManager.currentPlayer;
          gameManager.currentHuntNb = 0;
          gameManager.stateMachine.enterState("round-end");
        } else {
          // Switch turns after a player takes a shot in PVP mode
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

      // Update measure display for solo mode
      if (gameManager.gameMode === "solo") {
        const measureTextObj = k.get("measureText")[0];
        if (measureTextObj) {
          // Format measure display based on lesson type
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
            measureTextObj.text = gameManager.currentMeasure.toFixed(1); // Remove cm from current measure
          } else { // decimals
            measureTextObj.text = gameManager.currentMeasure.toFixed(1);
          }
        }
        
        // Update progress visualization based on lesson type
        if (gameManager.lessonType === "fractions") {
          // For fractions, update the pie chart sprite
          const pieProgress = k.get("fraction-progress")[0];
          if (pieProgress) {
            // Calculate progress as a ratio of current to goal measure
            let progress = Math.min(gameManager.currentMeasure / gameManager.goalMeasure, 1);
            
            // Determine which frame to show (0 to 7)
            const frameIndex = Math.min(Math.floor(progress * 8), 7);
            
            // Update the pie chart animation
            pieProgress.play(`fill-${frameIndex}`);
          }
        } else {
          // For other lesson types (whole numbers, measurements, decimals)
          // Use the black progress sprite segments
          if (gameManager.lessonType !== "fractions") {
            // Calculate progress as a ratio of current to goal measure
            let progress = Math.min(gameManager.currentMeasure / gameManager.goalMeasure, 1);
            
            // Determine how many segments to reveal (out of 8 total)
            const segmentsToReveal = Math.floor(progress * 8);
            
            // Get all progress segments with the specific tag for this lesson type
            const segmentTag = `${gameManager.lessonType}-progress-segment`;
            
            // Loop through segments and hide the appropriate number
            for (let i = 0; i < 8; i++) {
              // Find segments by their specific tag and segment number
              const segments = k.get(segmentTag);
              if (segments && segments.length > 0) {
                // If segment index is less than segments to reveal, make it invisible
                if (i < segmentsToReveal) {
                  segments[i].opacity = 0;
                }
              }
            }
          }
        }
      }
      
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

  k.onClick("pause-button", () => {
    // Trigger the same functionality as pressing the 'p' key
    backButton.opacity = backButton.opacity === 0 ? 1 : 0;
    backButtonText.opacity = backButtonText.opacity === 0 ? 1 : 0;
    
    k.getTreeRoot().paused = !k.getTreeRoot().paused;
    if (k.getTreeRoot().paused) {
      gameManager.isGamePaused = true;
      audioCtx.suspend();
      k.setCursor("default");
      
      // Stop all duck flapping sounds instead of accessing currentDuck
      const allDucks = k.get("duck");
      for (const duck of allDucks) {
        if (duck.flappingSound) {
          duck.flappingSound.stop();
        }
      }
      
      k.add([k.text("PAUSED", { font: "nes", size: 8 }), k.pos(5, 5), k.z(3), "paused-text"]);
    } else {
      gameManager.isGamePaused = false;
      audioCtx.resume();
      k.setCursor("none"); // Restore game cursor
      const pausedText = k.get("paused-text")[0];
      if (pausedText) k.destroy(pausedText);
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
    k.pos(10, 14), // Moved 4 pixels down from 10 to 14
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

    // SUBMIT SOLO SCORE TO DATABASE HERE using "params.score"

  }

  k.wait(2, () => {
    k.go("main-menu");
  });
});

// Start the game at the main-menu scene
k.go("main-menu");