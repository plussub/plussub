import { defineStore } from 'pinia';
import { get as storageGet, set as storageSet } from 'storage';
import { ContentLanguage, listContentLanguagesQuery } from '@/language/store/listContentLanguagesQuery';
import { ref } from 'vue';

export const useStore = defineStore('language', () => {
  const initialized = ref(false);
  const preferredContentLanguage = ref<ContentLanguage>({language_code: "en", language_name: "English"});
  const contentLanguages = ref<ContentLanguage[]>([]);
  const setPreferredContentLanguage = async (newPreferredContentLanguage: ContentLanguage) => {
    preferredContentLanguage.value = newPreferredContentLanguage;
    await storageSet({ preferredContentLanguage: newPreferredContentLanguage });
  };

  return {
    preferredContentLanguage,
    contentLanguages,
    initialized,
    async initialize() {
      const {preferredContentLanguage: loadedPreferredContentLanguage} = await storageGet(['preferredContentLanguage']);
      preferredContentLanguage.value = loadedPreferredContentLanguage ?? {language_code: "en", language_name: "English"};
      contentLanguages.value = (await listContentLanguagesQuery()).listContentLanguages.data;
      initialized.value = true;
    },
    setPreferredContentLanguage,
    async resetPreferredContentLanguageToDefault() {
      return setPreferredContentLanguage({language_code: "en", language_name: "English"});
    }
  };
})