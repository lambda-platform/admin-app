<template>
  <component :is="renderTheme()"
  :switchLanguage="switchLanguage"
  :lambda="lambda"
  :subTitle="subTitle"
  :languages="languages"
  :copyright="copyright"
  :title="title"
  :selectedLang="selectedLang"
  >
    <NuxtPage :key="$route.fullPath" :selectedLang="selectedLang" />
  </component>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { LAMBDA_CONFIG } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import { loadLocaleMessages, setI18nLanguage} from '@lambda-platform/lambda-vue/src/locale'
import { i18n} from '~/locale'
export default defineComponent({

  setup(props) {
    const { proxy } = getCurrentInstance();
    const LambdaConfig = ls.get(LAMBDA_CONFIG)
    const selectedLang = proxy.$i18n.locale
    const switchLanguage = async(key) =>{

      proxy.$i18n.locale = key;

      ls.set('lang', key)
      if (!i18n.global.availableLocales.includes(key)) {
        await loadLocaleMessages(i18n, key)
      }
      setI18nLanguage(i18n, key);
      // window.location.reload();

    }
    const renderTheme = () => {
      return defineAsyncComponent(() => import(`../../node_modules/@lambda-platform/lambda-vue/src/modules/agent/views/theme/${LambdaConfig.theme}/index.vue`))
    }
    return {

      selectedLang,
      languages: LambdaConfig.languages,
      copyright: LambdaConfig.copyright,
      title:LambdaConfig.title,
      subTitle: LambdaConfig.subTitle,
      lambda: LambdaConfig,

      switchLanguage,
      renderTheme
    }
  },


})
</script>
