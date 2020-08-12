import { onMounted, onUnmounted } from 'vue';
import { AppState } from '@/appState';

export function useAppStateStorageListener(handler: (appState: AppState) => void): void {
  const listener = (changes) => {
    const result = Object.entries<Record<string, { newValue: any }>>(changes).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value.newValue
      };
    }, {});
    return handler(result as AppState);
  };

  onMounted(() => chrome.storage.onChanged.addListener(listener));
  onUnmounted(() => chrome.storage.onChanged.removeListener(listener));
}
