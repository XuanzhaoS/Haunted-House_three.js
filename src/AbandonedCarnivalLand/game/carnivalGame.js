import * as THREE from "three";

export class CarnivalGame {
  constructor() {
    this.score = 0;
    this.isGameActive = false;
  }

  startGame() {
    this.isGameActive = true;
    this.score = 0;
    console.log("Carnival game started!");
  }

  endGame() {
    this.isGameActive = false;
    console.log(`Game ended! Final score: ${this.score}`);
  }

  addScore(points) {
    if (this.isGameActive) {
      this.score += points;
      console.log(`Score: ${this.score}`);
    }
  }

  update(elapsedTime) {
    if (this.isGameActive) {
      // Add game logic updates here
    }
  }
}
