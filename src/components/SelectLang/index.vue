<template>
  <a-dropdown>
    <span class="header-notice">
      <span class="btn btn-icon">
            <span class="svg-icon ">
                <inline-svg
                  src="/assets/icons/duotune/maps/map004.svg"
                />
            </span>
       </span>
     </span>
    <template #overlay>
      <a-menu class="menu ant-pro-header-menu">
        <a-menu-item key="4" @click="changeLang(locale)" v-for="locale in locales" :key="locale">
          <span role="img" aria-label="{languageLabels[locale]}">
              {{ languageIcons[locale] }}&nbsp;
            </span>
          {{ languageLabels[locale] }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>

import ls from '~/utils/Storage'
import { loadLocaleMessages } from '@lambda-platform/lambda-vue/src/locale'
import { i18n } from '~/locale'

export default {
  name: 'index',
  components: {},
  methods: {
    async changeLang (key) {

      ls.set('lang', key)
      this.currentLang = key

      if (!i18n.global.availableLocales.includes(key)) {
        await loadLocaleMessages(i18n, key)
      }
      // setI18nLanguage(i18n, key);
      this.$i18n.locale = key
      window.location.reload()
      // nextTick(() => {
      //
      //   console.log("changed")
      // })

    }
  },
  data () {
    return {
      locales: ['mn_MN', 'en_US'],
      currentLang: 'mn_MN',
      languageLabels: {

        'en_US': 'English',
        'mn_MN': 'Монгол',

      },
      languageIcons: {

        'en_US': '🇺🇸',
        'mn_MN': '🇲🇳',

      }
    }
  }
}
</script>

<style scoped>

</style>
