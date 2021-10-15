<template>
  <PageLayout :content-transition-name="contentTransitionName">
    <template #toolbar>
      <Toolbar has-back :back-fn="backFn"></Toolbar>
    </template>
    <template #content>
      <div class="pt-2 px-2">
        <div class="font-header font-medium text-xl">User data</div>
        <div style="grid-area: detail; grid-template-columns: auto 1fr; grid-column-gap: 16px" class="grid w-full leading-relaxed">
          <div style="grid-column: 1 / 2" class="font-medium">Preferred language</div>
          <div style="grid-column: 2 / 3">{{ preferredLanguage }}</div>
          <div style="grid-column: 1 / 2" class="font-medium">Api</div>
          <div style="grid-column: 2 / 3" class="flex items-center">
            <label for="stable" class="pr-1">stable</label>
            <input id="stable" v-model="apiVersion" type="radio" value="stable" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />
            <label for="dev" class="pl-2 pr-1">dev</label>
            <input id="dev" v-model="apiVersion" type="radio" value="dev" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />
          </div>
        </div>
        <div class="flex w-full justify-end px-4">
          <a class="text-primary-500 hover:text-primary-700" @click="clearUserData">
            <span class="pr-1"> Reset </span>
          </a>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { clear as storageClear } from 'storage';

import PageLayout from '@/components/PageLayout.vue';
import { useInjectStore } from '@/composables/useInjectStore';
import Toolbar from '@/Toolbar/Toolbar.vue';

export default defineComponent({
  components: {
    Toolbar,
    PageLayout
  },
  props: {
    contentTransitionName: {
      type: String as PropType<string>,
      required: false,
      default: ''
    }
  },
  setup() {
    const apiStore = useInjectStore('apiStore');
    const searchStore = useInjectStore('searchStore');
    const navigationStore = useInjectStore('navigationStore');
    const videoStore = useInjectStore('videoStore');

    return {
      preferredLanguage: computed(() => searchStore.state.value.preferredLanguage),
      apiVersion: computed({
        get() {
          return apiStore.state.value.version;
        },
        set(version: 'stable' | 'dev') {
          apiStore.actions.setVersion({ version });
        }
      }),
      clearUserData: async () => {
        await storageClear();
        searchStore.actions.setPreferredLanguage({ preferredLanguage: 'en' });
        apiStore.actions.setVersion({ version: 'stable' });
      },
      backFn: () => (videoStore.getters.count.value === 1 ? navigationStore.actions.toMovieTvSearch() : navigationStore.actions.toHome())
    };
  }
});
</script>
