<template>
  <div class="login aside-theme" :style="{ backgroundImage: 'url(' + lambda.bg + ')' }">
    <div class="content">
      <div class="content-layer"></div>
      <div class="title">
        <h2 style="max-width: 600px;">{{ title }}</h2>
        <p>{{ subTitle }}</p>
      </div>
    </div>
    <div class="auth">
      <div class="lang-switcher" v-if="lambda.has_language && languages.length >= 2">
        <a v-for="item in languages" :key="item.index"
           :class="selectedLang === item.code ? 'active' : ''" href="javascript:void(0)"
           @click="switchLanguage(item.code)">
          {{ item.label }}
        </a>
      </div>
      <div class="form-wrap">
<!--        <NuxtPage :key="$route.fullPath"/>-->
        <NuxtPage :key="$route.fullPath" :selectedLang="selectedLang"/>
        <div class="copyright" style="width:70%; text-align:center;" v-html="copyright"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { LAMBDA_CONFIG } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import { loadLocaleMessages, setI18nLanguage} from '@lambda-platform/lambda-vue/src/locale'
import { i18n} from '~/locale'
export default {

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
      window.location.reload();

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
      switchLanguage
    }
  },


}
</script>

<style lang="scss">
@import "../vue3/src/modules/agent/scss/theme/aside/style";
</style>

