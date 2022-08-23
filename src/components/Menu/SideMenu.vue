<template>
  <a-layout-sider
    :class="['sider', isDesktop ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model:collapsed="collapsed"
    :trigger="null"
  >
    <logo/>
    <div class="btn btn-icon inline side-toggle rounded-sm shadow" @click="toggle">
      <span class="svg-icon">
         <inline-svg v-if="collapsed" src="/assets/icons/duotune/arrows/arr080.svg"/>
         <inline-svg v-else           src="/assets/icons/duotune/arrows/arr079.svg"/>
      </span>
    </div>
    <Menu :collapsed="collapsed" :theme="theme" :mode="mode"></Menu>
    <Logout class="logout-btn-side" v-if="isDesktop" :show-title="!collapsed"/>
  </a-layout-sider>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Logo from '~/components/tools/Logo.vue'
import Logout from '~/components/tools/Logout.vue'
import Menu from './Menu.vue'
import { isDesktop } from '~/utils/device'
import { fixSiderbar } from '~/store/useSiteSettings'

export default defineComponent({
  name: 'SideMenu',
  components: { Logo, Menu, Logout },
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
      fixSiderbar,
    }
  }
})
</script>
