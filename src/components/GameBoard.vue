<!-- TODO: Разделить на компоненты, вынести основную часть в App.vue -->
<template>
  <div id="game">
    <div id="game-board">
      <BoardCell
        v-for="cell in cells"
        :key="cell.id"
        :cell="cell"
        @cell-clicked="handleCellClicked"
      />
      <div v-if="movingCell" class="moving-cell" :style="movingCellStyle">
        <div class="ball big-ball selected" :style="{ backgroundColor: movingCell.color }"></div>
      </div>
    </div>
    <ScoreDisplay :score="score" />
    <GameOverModal v-if="gameOver" :isVisible="gameOver" :score="score" @close="restartGame" />
  </div>
  <SideMenu />
</template>

<script>
import { onMounted, computed, toRefs } from 'vue';
import { useGameStore } from '@/store/gameStore';
import BoardCell from '@/components/BoardCell.vue';
import ScoreDisplay from '@/components/ScoreDisplay.vue';
import GameOverModal from './GameOverModal.vue';
import SideMenu from '@/components/SideMenu.vue';

export default {
  name: 'GameBoard',
  components: {
    SideMenu,
    BoardCell,
    ScoreDisplay,
    GameOverModal,
  },
  setup() {
    const gameStore = useGameStore();
    const { cells, score, movingCell, handleCellClicked, initBoard } = gameStore;
    const { gameOver } = toRefs(gameStore);

    const movingCellStyle = computed(() => {
      if (!movingCell.value) return {};
      return {
        position: 'absolute',
        top: movingCell.value.top + 'px',
        left: movingCell.value.left + 'px',
      };
    });

    onMounted(() => {
      initBoard();
    });

    const restartGame = () => {
      gameStore.startNewGame();
    };

    return {
      cells,
      score,
      movingCell,
      movingCellStyle,
      handleCellClicked,
      gameOver,
      restartGame,
    };
  },
};
</script>
