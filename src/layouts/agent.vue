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

    <NuxtPage :key="$route.fullPath" />
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
      return defineAsyncComponent(() => import(`../../vue3/src/modules/agent/views/theme/${LambdaConfig.theme}/index.vue`))
    }
    return {
      loading: false,
      isSuccess: false,
      isError: false,
      credentials: {
        login: null,
        password: null
      },
      selectedLang: proxy.$i18n.locale,
      languages: LambdaConfig.languages,
      copyright: LambdaConfig.copyright,
      title:LambdaConfig.title,
      subTitle: LambdaConfig.subTitle,
      lambda: LambdaConfig,
      styleObj: {
        backgroundImage: LambdaConfig.bg + ' !important'
      },
      switchLanguage,
      renderTheme
    }
  },


})
</script>
