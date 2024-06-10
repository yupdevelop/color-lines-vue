<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal">
      <h2>Игра окончена!</h2>
      <p>Все ячейки заполнены. Ваш счёт: {{ score }}.</p>
      <button @click="closeModal">ОК</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    score: Number,
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>
