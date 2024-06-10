export default class GameLogic {
  constructor(gameState) {
    this.gameState = gameState;
    this.cells = gameState.cells;
  }

  checkLines() {
    const horizontalLines = this.checkHorizontalLines();
    const verticalLines = this.checkVerticalLines();

    if (horizontalLines.length > 0 || verticalLines.length > 0) {
      return horizontalLines.concat(verticalLines);
    }

    return false;
  }

  checkHorizontalLines() {
    const horizontalLines = [];
    for (let row = 0; row < 9; row++) {
      let consecutiveCount = 1;
      let currentColor = null;
      for (let col = 0; col < 9; col++) {
        const cell = this.cells[row * 9 + col];
        if (!cell.ball) {
          consecutiveCount = 1;
          currentColor = null;
        } else {
          const ballColor = cell.ball.color;
          if (ballColor === currentColor) {
            consecutiveCount++;
            if (consecutiveCount >= this.gameState.settings.ballsForLineRemoval) {
              for (let i = 0; i < consecutiveCount; i++) {
                horizontalLines.push(row * 9 + col - i);
              }
            }
          } else {
            consecutiveCount = 1;
            currentColor = ballColor;
          }
        }
      }
    }
    return horizontalLines;
  }

  checkVerticalLines() {
    const verticalLines = [];
    for (let col = 0; col < 9; col++) {
      let consecutiveCount = 1;
      let currentColor = null;
      for (let row = 0; row < 9; row++) {
        const cell = this.cells[row * 9 + col];
        if (!cell.ball) {
          consecutiveCount = 1;
          currentColor = null;
        } else {
          const ballColor = cell.ball.color;
          if (ballColor === currentColor) {
            consecutiveCount++;
            if (consecutiveCount >= this.gameState.settings.ballsForLineRemoval) {
              for (let i = 0; i < consecutiveCount; i++) {
                verticalLines.push((row - i) * 9 + col);
              }
            }
          } else {
            consecutiveCount = 1;
            currentColor = ballColor;
          }
        }
      }
    }
    return verticalLines;
  }

  removeLines(linesToRemove) {
    const uniqueCellsToRemove = [...new Set(linesToRemove)];
    let cellCount = uniqueCellsToRemove.length;

    uniqueCellsToRemove.forEach(index => {
      this.cells[index].removing = true;

      setTimeout(() => {
        this.cells[index].ball = null;
        delete this.cells[index].removing;
      }, 500);
    });

    return cellCount;
  }

  calculatePoints(cellCount) {
    let addedPoints;
    if (cellCount <= 3) {
      addedPoints = cellCount;
    } else {
      addedPoints = 3 + (cellCount - 3) * 2;
    }

    this.gameState.score += addedPoints;
    return addedPoints;
  }

  checkGameEnd() {
    if (this.cells.every(cell => cell.ball !== null && !cell.removing)) {
      return true;
    }

    return false;
  }
}
