import k from "./kaplayCtx";
 
class GameManager {
  isGamePaused = false;
  gameMode = "solo"; // Default to solo mode
  currentPlayer = 1; // Player 1 or 2 for PVP mode
  p1Measure = 0; // Player 1's measure for PVP mode
  p2Measure = 0; // Player 2's measure for PVP mode
  pvpWinner = 0; // Store the winner in PVP mode
  lastDuckValue = null; // Track the value of the last duck that appeared
  
  // Add lesson type properties
  lessonType = "measurements"; // Default to measurements
  difficultyLevel = "beginner"; // Default to beginner
 
  constructor() {
    this.initializeGameState();
    this.stateMachine = k.add([
      k.state("menu", [
        "menu",
        "cutscene",
        "round-start",
        "round-end",
        "hunt-start",
        "hunt-end",
        "duck-hunted",
        "duck-escaped",
      ]),
    ]);
    
    // Load lesson settings from localStorage if available
    this.loadLessonSettings();
  }
  
  loadLessonSettings() {
    // Try to load the settings from localStorage
    if (typeof localStorage !== 'undefined') {
      const savedLessonType = localStorage.getItem('measure-hunt-lesson');
      const savedDifficultyLevel = localStorage.getItem('measure-hunt-difficulty');
      
      if (savedLessonType) {
        this.lessonType = savedLessonType;
      }
      
      if (savedDifficultyLevel) {
        this.difficultyLevel = savedDifficultyLevel;
      }
    }
  }
 
  // Helper function to get the background sprite name based on lesson type
  getBackgroundSprite() {
    switch (this.lessonType) {
      case "whole-numbers":
        return "backgroundwhole";
      case "fractions":
        return "backgroundfraction";
      case "measurements":
        return "backgroundmeasure";
      case "decimals":
        return "backgrounddecimal";
      default:
        return "background"; // Default background
    }
  }
 
  initializeGameState() {
    this.currentScore = 0;
    this.currentRoundNb = 0;
    this.currentHuntNb = 0;
    this.nbBulletsLeft = 3;
    this.nbDucksShotInRound = 0;
    this.preySpeed = 100;
    this.goalMeasure = 0;
    this.currentMeasure = 0;
    this.p1Measure = 0;
    this.p2Measure = 0;
    this.pvpWinner = 0;
    this.pvpRound = 1; // Always round 1 for PVP mode
    this.lastDuckValue = null; // Reset the last duck value
  }
 
  // Helper function to get current player's measure
  getCurrentPlayerMeasure() {
    return this.currentPlayer === 1 ? this.p1Measure : this.p2Measure;
  }
 
  // Helper function to update current player's measure
  updateCurrentPlayerMeasure(value) {
    if (this.currentPlayer === 1) {
      this.p1Measure += value;
    } else {
      this.p2Measure += value;
    }
  }
}
 
const gameManager = new GameManager();
export default gameManager;