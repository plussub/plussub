import { onMounted, onUnmounted } from 'vue';
import {AppState} from "../../shared/appState";

export function useAppStateStorageListener(handler: (appState: AppState) => void) {
  const listener = ({ key, newValue }) => {
    if (key !== 'appState' || !newValue) {
      return;
    }
    return handler(JSON.parse(newValue));
  };
  onMounted(() => window.addEventListener('storage', listener));
  onUnmounted(() => window.removeEventListener('storage', listener));
}
