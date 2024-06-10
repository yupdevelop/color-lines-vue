<template>
  <div
    class="cell"
    :class="{ selected: cell.selected, unreachable: cell.unreachable, removing: cell.removing }"
    @click="clickCell"
  >
    <BoardBall
      v-if="cell.ball"
      :color="cell.ball.color"
      :size="cell.ball.size"
      :selected="cell.selected"
    />
  </div>
</template>

<script>
import BoardBall from './BoardBall.vue';

export default {
  name: 'BoardCell',
  components: {
    BoardBall,
  },
  props: {
    cell: {
      type: Object,
      required: true,
    },
    unreachable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickCell() {
      this.$emit('cell-clicked', this.cell);
    },
  },
};
</script>
