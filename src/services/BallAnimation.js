export default class BallAnimation {
  constructor(cellSize) {
    this.cellSize = cellSize;
  }

  animateBallMove(startCell, path, cellSize, updateMovingCell, completeAnimation) {
    let movingCell = {
      color: startCell.ball.color,
      top: startCell.row * cellSize + 21,
      left: startCell.col * cellSize + 21,
    };
    startCell.ball = null;

    const moveNext = index => {
      if (index < path.length) {
        const nextCell = path[index];
        movingCell.top = nextCell.row * cellSize + 21;
        movingCell.left = nextCell.col * cellSize + 21;

        updateMovingCell({ ...movingCell });

        setTimeout(() => moveNext(index + 1), 50);
      } else {
        setTimeout(() => {
          completeAnimation();
        }, 10);
      }
    };

    moveNext(0);
  }
}
