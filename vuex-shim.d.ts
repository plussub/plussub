import { ComponentCustomProperties } from 'vue';
import { State } from './src/popup/store/index';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
