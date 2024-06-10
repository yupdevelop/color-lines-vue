import { reactive, toRefs, watchEffect } from 'vue';
import GameLogic from '@/services/GameLogic';
import BallGenerator from '@/services/BallGenerator';
import PathFinder from '@/services/PathFinder';
import BallAnimation from '@/services/BallAnimation';

// TODO: Вынести всю возможную логику игры в GameLogic.sj

const STORE_KEY = 'ColorLines';
const INITIAL_GAME_STATE = {
  roundCount: 0,
  score: 0,
  gameOver: false,
  selectedBall: null,
  movingCell: null,
  settings: {
    addBallsAfterLineRemoval: false,
    numberOfNewBalls: 3,
    ballsForLineRemoval: 5,
  },
};

const gameState = reactive({
  ...INITIAL_GAME_STATE,
  colors: ['red', 'blue', 'green', 'yellow', 'purple'],
  cells: [],
  cellSize: 57,
});

const initBoard = (newGame = false) => {
  gameState.cells = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      gameState.cells.push({
        id: row * 9 + col,
        row: row,
        col: col,
        ball: null,
      });
    }
  }
  setTimeout(() => {
    initGame(newGame);
  });
};

const initGame = (newGame = false) => {
  gameState.gameLogic = new GameLogic(gameState);
  gameState.ballGenerator = new BallGenerator(gameState.colors);
  gameState.pathFinder = new PathFinder(gameState.cells, gameState.cellSize);
  gameState.ballAnimation = new BallAnimation(gameState.cellSize);
  if (newGame || !loadGameState()) {
    generateRandomBalls();
  }
};

const generateRandomBalls = () => {
  const numberOfBalls = gameState.roundCount === 0 ? 6 : gameState.settings.numberOfNewBalls;
  for (let i = 0; i < numberOfBalls; i++) {
    let randomCell = getRandomEmptyCell();
    if (randomCell) {
      randomCell.ball = gameState.ballGenerator.generateRandomBall(
        i >= gameState.settings.numberOfNewBalls,
      );
    }
  }
  gameState.roundCount++;
};

const getRandomEmptyCell = () => {
  const emptyCells = gameState.cells.filter(cell => !cell.ball);
  if (emptyCells.length === 0) {
    return null;
  }
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const handleCellClicked = cell => {
  if (cell.ball && cell.ball.size === 'big') {
    if (gameState.selectedBall) {
      gameState.selectedBall.selected = false;
    }
    gameState.selectedBall = cell;
    gameState.selectedBall.selected = true;
  } else if (gameState.selectedBall && (!cell.ball || (cell.ball && cell.ball.size === 'small'))) {
    const path = gameState.pathFinder.hasClearPath(gameState.selectedBall, cell);
    if (path.length > 0) {
      animateBallMove(path);
    } else {
      cell.unreachable = true;
      setTimeout(() => {
        cell.unreachable = false;
      }, 500);
    }
  }
};

const transformSmallBallsToBig = () => {
  gameState.cells.forEach(cell => {
    if (cell.ball && cell.ball.size === 'small') {
      if (cell.ball && cell.ball.size === 'big') {
        let newCell = getRandomEmptyCell();
        if (newCell) {
          newCell.ball = { ...cell.ball, size: 'big' };
          cell.ball = null;
        }
      } else {
        cell.ball.size = 'big';
      }
    }
  });
};

const animateBallMove = path => {
  const startCell = gameState.cells.find(c => c.row === path[0].row && c.col === path[0].col);
  gameState.ballAnimation.animateBallMove(
    startCell,
    path,
    gameState.cellSize,
    movingCell => {
      gameState.movingCell = movingCell;
    },
    () => {
      finishBallMove(path, gameState.movingCell);
    },
  );
};

const finishBallMove = (path, movingCell) => {
  const endCell = gameState.cells.find(
    c => c.row === path[path.length - 1].row && c.col === path[path.length - 1].col,
  );
  if (endCell.ball && endCell.ball.size === 'small') {
    let newCell = getRandomEmptyCell();
    if (newCell) {
      newCell.ball = { ...endCell.ball, size: 'big' };
    }
  }
  endCell.ball = null;
  setTimeout(() => {
    endCell.ball = {
      color: movingCell.color,
      size: 'big',
    };
    gameState.movingCell = null;
    afterBallMove();
  }, 10);
};

const areOnlySmallBallsOnBoard = () => {
  return gameState.cells.every(cell => !cell.ball || cell.ball.size === 'small');
};

const afterBallMove = () => {
  if (gameState.selectedBall) {
    gameState.selectedBall.selected = false;
    gameState.selectedBall = null;
  }

  setTimeout(() => {
    const linesToRemove = gameState.gameLogic.checkLines();
    if (!linesToRemove || gameState.settings.addBallsAfterLineRemoval) {
      transformSmallBallsToBig();
    }
    if (linesToRemove.length > 0) {
      const cellCount = gameState.gameLogic.removeLines(linesToRemove);
      gameState.score += gameState.gameLogic.calculatePoints(cellCount);
    }
    const gameEnd = gameState.gameLogic.checkGameEnd();
    if (gameEnd) {
      gameState.gameOver = true;
    } else if (!linesToRemove || gameState.settings.addBallsAfterLineRemoval) {
      generateRandomBalls();
    }

    if (!gameEnd) {
      setTimeout(() => {
        if (areOnlySmallBallsOnBoard()) {
          transformSmallBallsToBig();
        }
        saveGameState();
      }, 500);
    }
  }, 100);
};

const startNewGame = () => {
  Object.assign(gameState, INITIAL_GAME_STATE);

  initBoard(true);
  setTimeout(() => {
    saveGameState();
  }, 500);
};

const saveGameState = (stateKey = 'current') => {
  const savedState = {
    roundCount: gameState.roundCount,
    score: gameState.score,
    balls: gameState.cells
      .filter(cell => cell.ball)
      .map(cell => ({
        id: cell.id,
        color: cell.ball.color,
        size: cell.ball.size,
      })),
    settings: gameState.settings,
  };

  const savedGamesString = localStorage.getItem(STORE_KEY);
  const savedGames = savedGamesString ? JSON.parse(savedGamesString) : {};

  savedGames[stateKey] = savedState;
  localStorage.setItem(STORE_KEY, JSON.stringify(savedGames));

  if (stateKey !== 'current') {
    updateSavedSlots();
  }
};

const loadGameState = (stateKey = 'current') => {
  const savedStateString = localStorage.getItem(STORE_KEY);
  if (savedStateString) {
    const savedState = JSON.parse(savedStateString)[stateKey];

    if (savedState) {
      gameState.roundCount = savedState.roundCount;
      gameState.score = savedState.score;
      gameState.gameOver = false;
      gameState.cells.forEach(cell => {
        cell.ball = null;
      });
      setTimeout(() => {
        savedState.balls.forEach(savedBall => {
          const cell = gameState.cells.find(cell => cell.id === savedBall.id);
          if (cell) {
            cell.ball = {
              color: savedBall.color,
              size: savedBall.size,
            };
          }
        });
        if (savedState.settings) {
          gameState.settings = savedState.settings;
        }
      }, 100);

      return true;
    }
  }
  return false;
};

const savedSlots = reactive({});

const updateSavedSlots = () => {
  const savedGamesString = localStorage.getItem(STORE_KEY);
  const savedGames = savedGamesString ? JSON.parse(savedGamesString) : {};
  Object.entries(savedGames).forEach(([key, value]) => {
    if (key.startsWith('slot-')) {
      savedSlots[key] = {
        score: value.score,
        roundCount: value.roundCount,
      };
    }
  });
};

updateSavedSlots();

watchEffect(() => {
  updateSavedSlots();
});

export function useGameStore() {
  return {
    ...toRefs(gameState),
    initBoard,
    handleCellClicked,
    animateBallMove,
    startNewGame,
    savedSlots,
    saveGameState,
    loadGameState,
  };
}
