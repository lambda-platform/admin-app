<template>
  <div class="setting-drawer">
    <a-drawer
      width="320"
      placement="right"
      @close="onClose"
      :closable="isMobile"
      :visible="state.app.showSettings"
    >
      <div class="setting-drawer-index-content">

        <GlobalStyle />

        <ThemeColor />

        <NavigationMode />

        <LayoutSettings />

        <OtherSettings />
      </div>

      <div>
        <a-button block @click="resetSettings">
          <template #icon>
                      <span class="svg-icon">
                        <inline-svg
                          src="/assets/icons/duotone/General/Update.svg"
                        />
                      </span>
          </template>
          {{ $t('settingDrawer.reset') }}
        </a-button>
      </div>

      <template #handle>
        <div class="setting-drawer-index-handle" v-if="state.app.showSettings" @click="onClose">
          <CloseOutlined style="color: #fff" />
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { CloseOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { SET_SETTING_DRAWER } from '~/store/mutation-types'
import { isDev } from '~/utils/util'
import GlobalStyle from './components/GlobalStyle.vue'
import ThemeColor from './components/ThemeColor.vue'
import NavigationMode from './components/NavigationMode.vue'
import LayoutSettings from './components/LayoutSettings.vue'
import OtherSettings from './components/OtherSettings.vue'
import { isMobile } from '~/utils/device'

export default defineComponent({
  components: {
    CloseOutlined,
    CopyOutlined,
    GlobalStyle,
    ThemeColor,
    NavigationMode,
    LayoutSettings,
    OtherSettings
  },
  setup() {
    const { state, commit } = useStore()

    const onClose = () => {
      commit(SET_SETTING_DRAWER, false)
    }
    const resetSettings = () =>{
      localStorage.removeItem("SITE_SETTINGS");
      window.location.reload();
    }

    return {
      state,
      onClose,
      resetSettings,
      isDev,
      isMobile
    }
  }
})
</script>
