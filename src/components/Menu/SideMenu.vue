<template>
  <a-layout-sider
    :class="['sider', isDesktop ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    :width="layoutMode === 'sidemenu' || !isDesktop ? '256px' :'120px'"
    :collapsible="collapsible"
    :collapsed-width="70"
    v-model:collapsed="collapsed"
    :trigger="null"
  >

    <logo :showTitle="!isDesktop ? false : layoutMode === 'sidemenu' && layoutMode !== 'levelmenu' && !collapsed"/>
    <div class="btn btn-icon inline side-toggle rounded-sm shadow-xs" @click="toggle" v-if="layoutMode === 'sidemenu'">
      <span class="svg-icon">
         <inline-svg v-if="collapsed" src="/assets/icons/duotune/arrows/arr080.svg"/>
         <inline-svg v-else           src="/assets/icons/duotune/arrows/arr079.svg"/>
      </span>
    </div>
    <Menu :collapsed="collapsed" :theme="theme" :mode="mode" v-if="layoutMode === 'sidemenu' || !isDesktop"></Menu>
    <LevelMenu :collapsed="collapsed" :theme="theme" :mode="mode" v-if="layoutMode === 'levelmenu' && isDesktop"></LevelMenu>
    <Logout class="logout-btn-side bg-white dark:bg-slate-900" v-if="isDesktop" :show-title="!collapsed"/>
  </a-layout-sider>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Logo from '~/components/tools/Logo.vue'
import Logout from '~/components/tools/Logout.vue'
import Menu from './Menu.vue'
import LevelMenu from './LevelMenu.vue'
import { isDesktop } from '~/utils/device'
import { fixSiderbar, layoutMode } from '~/store/useSiteSettings'

export default defineComponent({
  name: 'SideMenu',
  components: { Logo, Menu, Logout, LevelMenu },
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },

    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  setup(props, { emit }) {

    const toggle = () => {
      emit('toggle')
    }
    return {
      isDesktop,
      toggle,
      layoutMode,
      fixSiderbar,
    }
  }
})
</script>
