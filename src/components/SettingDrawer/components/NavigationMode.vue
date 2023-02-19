<template>
  <SettingItem :title="$t('settingDrawer.navigationMode')">
    <div class="setting-drawer-index-blockChecbox">
      <a-tooltip>
        <template #title>{{ $t('settingDrawer.sidebarNavigater') }}</template>
        <div class="setting-drawer-index-item nav-img" @click="handleLayout('sidemenu')">
          <img src="../icons/sideMenu.svg" alt="sidemenu" />
          <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu' && sidebarOpened">
            <CheckOutlined />
          </div>
        </div>
      </a-tooltip>
      <a-tooltip>
        <template #title>{{ $t('settingDrawer.topNavigater') }}</template>
        <div class="setting-drawer-index-item nav-img" @click="handleLayout('topmenu')">
          <img src="../icons/topMenu.svg" alt="topmenu" />
          <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'topmenu'">
            <CheckOutlined />
          </div>
        </div>
      </a-tooltip>
    </div>
    <div class="setting-drawer-index-blockChecbox">

      <a-tooltip>
        <template #title>{{ $t('settingDrawer.twoLevelNavigater') }}</template>
        <div class="setting-drawer-index-item nav-img" @click="handleLayout('levelmenu')">
          <img src="../icons/LevelMenu.svg" alt="levelmenu" />
          <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'levelmenu'">
            <CheckOutlined />
          </div>
        </div>
      </a-tooltip>
      <a-tooltip>
        <template #title>{{ $t('settingDrawer.slimMenu') }}</template>
        <div class="setting-drawer-index-item nav-img" @click="handleSlimLayout('sidemenu')">
          <img src="../icons/slimMenu.svg" alt="slimmenu" />
          <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu' && !sidebarOpened">
            <CheckOutlined />
          </div>
        </div>
      </a-tooltip>

    </div>
  </SettingItem>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { TOGGLE_LAYOUT_MODE, TOGGLE_FIXED_SIDERBAR, SET_SIDEBAR_TYPE } from '~/store/mutation-types'
import { layoutMode, sidebarOpened } from '~/store/useSiteSettings'
import { CheckOutlined } from '@ant-design/icons-vue'
import SettingItem from './SettingItem.vue'

export default defineComponent({
  components: {
    CheckOutlined,
    SettingItem
  },
  setup() {
    const { state, commit } = useStore()

    const handleLayout = (mode) => {
      commit(TOGGLE_LAYOUT_MODE, mode)
      commit(SET_SIDEBAR_TYPE,true)
      handleFixSiderbar(false)
    }
    const handleSlimLayout = (mode) => {
      commit(TOGGLE_LAYOUT_MODE, mode)
      commit(SET_SIDEBAR_TYPE,false)
      handleFixSiderbar(false)
    }

    const handleFixSiderbar = (fixed) => {
      if (state.app.layoutMode === 'topmenu') {
        commit(TOGGLE_FIXED_SIDERBAR, true)
        return
      }
      commit(TOGGLE_FIXED_SIDERBAR, fixed)
    }

    return {
      handleLayout,
      handleSlimLayout,
      layoutMode,
      sidebarOpened
    }
  }
})
</script>
<style lang="less" scoped>
</style>
