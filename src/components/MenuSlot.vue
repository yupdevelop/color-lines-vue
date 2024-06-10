<template>
  <div class="menu-slot" @click="selectSlot">{{ slotNumber }}: {{ scoreDisplay }}</div>
</template>

<script>
export default {
  props: {
    slotNumber: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: null,
    },
  },
  computed: {
    scoreDisplay() {
      if (this.score === null) return 'пусто';
      return `${this.score} ${this.pluralize(this.score, ['очко', 'очка', 'очков'])}`;
    },
  },
  methods: {
    selectSlot(event) {
      event.stopPropagation();
      this.$emit('select', this.slotNumber);
    },
    pluralize(number, titles) {
      const cases = [2, 0, 1, 1, 1, 2];
      return titles[
        number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
      ];
    },
  },
};
</script>
