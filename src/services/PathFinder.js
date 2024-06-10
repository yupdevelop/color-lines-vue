export default class PathFinder {
  constructor(cells, cellSize) {
    this.cells = cells;
    this.cellSize = cellSize;
  }

  hasClearPath(startCell, endCell) {
    const queue = [[startCell]];
    const visited = new Set([`${startCell.row},${startCell.col}`]);

    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentCell = currentPath[currentPath.length - 1];

      if (currentCell.row === endCell.row && currentCell.col === endCell.col) {
        return currentPath;
      }

      const neighbors = this.getNeighbors(currentCell);
      for (let neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(key)) {
          const newPath = [...currentPath, neighbor];
          queue.push(newPath);
          visited.add(key);
        }
      }
    }

    return [];
  }

  getNeighbors(cell) {
    const neighbors = [];
    const row = cell.row;
    const col = cell.col;

    const directions = [
      { row: row - 1, col: col },
      { row: row + 1, col: col },
      { row: row, col: col - 1 },
      { row: row, col: col + 1 },
    ];

    directions.forEach(direction => {
      if (
        this.isValidCell(direction.row, direction.col) &&
        !this.isCellBlocked(direction.row, direction.col)
      ) {
        neighbors.push(direction);
      }
    });

    return neighbors;
  }

  isValidCell(row, col) {
    return row >= 0 && row < 9 && col >= 0 && col < 9;
  }

  isCellBlocked(row, col) {
    const index = row * 9 + col;
    if (index >= 0 && index < this.cells.length) {
      const cell = this.cells[index];
      return cell && cell.ball && cell.ball.size === 'big';
    }
    return false;
  }
}
