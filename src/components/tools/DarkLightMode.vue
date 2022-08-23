<template>
  <a-dropdown>
    <span class="header-notice">
      <span class="btn btn-icon">
              <span class="svg-icon">
                      <inline-svg v-if="darkMode"
                        src="/assets/icons/duotune/general/gen061.svg"
                      />
                      <inline-svg v-else
                        src="/assets/icons/duotune/general/gen060.svg"
                      />
              </span>
    </span>
    </span>

    <template #overlay>
      <a-menu class="user-dropdown-menu-wrapper">
        <a-menu-item key="4" @click="handleMenuTheme('light')">
          <a class="link link-icon ">
            <span class="svg-icon ">
                      <inline-svg
                        src="/assets/icons/duotune/general/gen060.svg"
                      />
              </span>
            <span>&nbsp;&nbsp;{{ $t('settingDrawer.lightStyle') }}</span>
          </a>
        </a-menu-item>
        <a-menu-item key="5" @click="handleDarkMode(true)">
          <a class="link link-icon">
            <span class="svg-icon ">
                      <inline-svg
                        src="/assets/icons/duotune/general/gen061.svg"
                      />
              </span>
            <span>&nbsp;&nbsp;{{ $t('settingDrawer.darkMode') }}</span>
          </a>
        </a-menu-item>
      </a-menu>
    </template>

  </a-dropdown>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { TOGGLE_THEME, SET_DARK_MODE } from '~/store/mutation-types'
import { navTheme, darkMode } from '~/store/useSiteSettings'

import { isMobile } from '~/utils/device'

export default defineComponent({
  components: {},
  setup () {
    const { commit } = useStore()

    const handleMenuTheme = (theme) => {
      commit(TOGGLE_THEME, theme)
    }

    const handleDarkMode = (isDark) => {
      commit(SET_DARK_MODE, isDark)
    }

    return {
      handleMenuTheme,
      handleDarkMode,
      navTheme,
      darkMode,

      isMobile,

    }
  }
})
</script>
