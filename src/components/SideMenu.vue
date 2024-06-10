<template>
  <div class="side-menu">
    <button @click="startNewGame">Новая игра</button>
    <button @click="toggleSaveSlots">Сохранить игру</button>
    <div v-if="showSaveSlots">
      <MenuSlot
        v-for="slot in displaySlots"
        :key="'save-' + slot.slotNumber"
        :slotNumber="slot.slotNumber"
        :score="slot.score"
        @select="saveGame"
      />
    </div>
    <button @click="toggleLoadSlots">Загрузить игру</button>
    <div v-if="showLoadSlots">
      <MenuSlot
        v-for="slot in displaySlots"
        :key="'load-' + slot.slotNumber"
        :slotNumber="slot.slotNumber"
        :score="slot.score"
        @select="loadGame"
      />
    </div>
    <button @click="toggleSettings">Настройки</button>
    <div v-if="showSettings" class="settings">
      <label>
        <input
          type="checkbox"
          v-model="settings.addBallsAfterLineRemoval"
          :disabled="roundCount > 5"
        />
        Добавлять шарики после удаления линий
      </label>
      <label class="flex">
        Количество новых шариков:
        <input
          type="number"
          v-model.number="settings.numberOfNewBalls"
          min="3"
          max="9"
          :disabled="roundCount > 5"
        />
      </label>
      <label class="flex">
        Шариков в линии для удаления:
        <input
          type="number"
          v-model.number="settings.ballsForLineRemoval"
          min="3"
          max="9"
          :disabled="roundCount > 5"
        />
      </label>
    </div>
    <div class="creator-signature">
      Сделано <a href="https://github.com/yupdevelop" target="_blank">@yupdevelop</a>
    </div>
  </div>
</template>

<script>
import { computed, ref, toRefs } from 'vue';
import MenuSlot from './MenuSlot.vue';
import { useGameStore } from '@/store/gameStore';

export default {
  components: {
    MenuSlot,
  },
  setup() {
    const gameStore = useGameStore();
    const showSaveSlots = ref(false);
    const showLoadSlots = ref(false);
    const showSettings = ref(false);
    const { roundCount } = toRefs(gameStore);

    const toggleSaveSlots = () => {
      showSaveSlots.value = !showSaveSlots.value;
      if (showLoadSlots.value) showLoadSlots.value = false;
      if (showSettings.value) showSettings.value = false;
    };

    const toggleLoadSlots = () => {
      showLoadSlots.value = !showLoadSlots.value;
      if (showSaveSlots.value) showSaveSlots.value = false;
      if (showSettings.value) showSettings.value = false;
    };

    const toggleSettings = () => {
      showSettings.value = !showSettings.value;
      if (showSaveSlots.value) showSaveSlots.value = false;
      if (showLoadSlots.value) showLoadSlots.value = false;
    };

    const displaySlots = computed(() => {
      const slots = [];
      for (let i = 1; i <= 5; i++) {
        const slotKey = 'slot-' + i;
        const slotData = gameStore.savedSlots[slotKey];
        slots.push({
          slotNumber: i,
          score: slotData ? slotData.score : null,
          roundCount: slotData ? slotData.roundCount : null,
        });
      }
      return slots;
    });

    const saveGame = slot => {
      gameStore.saveGameState('slot-' + slot);
      showSaveSlots.value = false;
    };

    const loadGame = slot => {
      gameStore.loadGameState('slot-' + slot);
      showLoadSlots.value = false;
    };

    return {
      displaySlots,
      showSaveSlots,
      showLoadSlots,
      toggleSaveSlots,
      toggleLoadSlots,
      saveGame,
      loadGame,
      showSettings,
      toggleSettings,
      roundCount,
      settings: gameStore.settings,
      ...gameStore,
    };
  },
};
</script>
