declare module '*.png';
declare module '*.svg';

declare module 'plussub-state' {
  import { NavigationState, CurrentSelectedSrcState } from '@/navigation/state/types';
  global {
    interface Window {
      plusSub_navigation: NavigationState;
      plusSub_currentSelectedSrc: CurrentSelectedSrcState;
    }
  }
}
