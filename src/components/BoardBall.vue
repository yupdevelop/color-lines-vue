<template>
  <div
    class="ball"
    :class="{ 'small-ball': isSmall, 'big-ball': size === 'big', selected: selected }"
    :style="{ backgroundColor: color }"
  ></div>
</template>

<script>
export default {
  name: 'BoardBall',
  props: {
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
      validator: value => ['small', 'big'].includes(value),
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSmall: false,
    };
  },
  mounted() {
    if (this.size === 'small') {
      setTimeout(() => {
        this.isSmall = true;
      }, 50);
    }
  },
};
</script>
