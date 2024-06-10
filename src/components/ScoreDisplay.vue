<template>
  <div id="score-display">Очки: {{ displayScore }}</div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'ScoreDisplay',
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const displayScore = ref(0);
    const animationDuration = 750;
    let animationInterval;

    watch(
      () => props.score,
      newScore => {
        clearInterval(animationInterval);
        const scoreDifference = newScore - displayScore.value;
        const steps = Math.abs(scoreDifference);
        const stepTime = animationDuration / (steps || 1);
        const stepSize = scoreDifference / (steps || 1);

        animationInterval = setInterval(() => {
          if (
            (scoreDifference > 0 && displayScore.value < newScore) ||
            (scoreDifference < 0 && displayScore.value > newScore)
          ) {
            displayScore.value += stepSize;
          } else {
            displayScore.value = newScore;
            clearInterval(animationInterval);
          }
        }, stepTime);
      },
    );

    return { displayScore };
  },
};
</script>
