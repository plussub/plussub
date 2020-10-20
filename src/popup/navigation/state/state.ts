import { computed } from 'vue';

export const navigationState = computed(() => window.plusSub_navigation.value);
export const currentSelectedVideoSrc = computed(() => window.plusSub_currentSelectedSrc.value);
