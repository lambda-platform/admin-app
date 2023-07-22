<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header
        v-if="visible"
        :class="[fixedHeader ? 'ant-header-fixedHeader' : '', !isMobile ? sidebarOpened ? 'ant-header-side-opened' :  'ant-header-side-closed' : '', ]"
        :style="{ padding: '0' }"
      >
        <div v-if="mode === 'sidemenu' || mode === 'levelmenu'" :class="mode === 'levelmenu' ? 'header md:pl-6 flex justify-between' : 'header md:pl-8 flex justify-between'">
          <span v-if="isMobile && !moduleHeader" class="float-left">
              <span class="trigger   btn btn-icon shadow-none" @click="toggle">
                <span class="svg-icon">
                   <inline-svg src="/assets/icons/duotone/Text/Menu.svg" />
                </span>
              </span>
          </span>
          <logo v-if="isMobile && !moduleHeader" :showTitle="false"/>
          <portal-target name="header-left" v-if="!isMobile">
          </portal-target>
          <portal-target name="header-mobile" v-if="isMobile">
          </portal-target>
          <div class="user-wrapper">
            <div class="content-box">
                <portal-target name="header-right" v-if="!isMobile">
                </portal-target>
                <user-menu :theme="theme"></user-menu>
            </div>
          </div>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
           <span v-if="isMobile && !moduleHeader" class="float-left">
              <span class="trigger btn btn-icon shadow-none" @click="toggle">
                <span class="svg-icon">
                   <inline-svg src="/assets/icons/duotone/Text/Menu.svg" />
                </span>
              </span>
          </span>
          <div class="header-index-wide" >
            <div class="header-index-left">
              <logo class="top-nav-header" :show-title="device !== 'mobile'" :style="`${!isMobile ? 'margin-left:25px' : ''}`"/>
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :theme="theme"/>
            </div>

            <div class="header-index-right">
              <user-menu :theme="theme"></user-menu>
            </div>

          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script lang="ts">
import UserMenu from '../tools/UserMenu/index.vue'
import SMenu from '../Menu/Menu.vue'
import Logo from '../tools/Logo.vue'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { sidebarOpened, device, fixedHeader, autoHideHeader } from '~/store/useSiteSettings'
import { isMobile } from '~/utils/device'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReloadOutlined
  },
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },

    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    moduleHeader: {
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
  setup (props, { emit }) {
    const visible = ref<boolean>(true)
    const oldScrollTop = ref<number>(0)
    const ticking = ref<boolean>(false)

    const handleScroll = () => {
      if (!autoHideHeader.value) {
        return
      }

      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!ticking.value) {
        ticking.value = true
        requestAnimationFrame(() => {
          if (oldScrollTop.value > scrollTop) {
            visible.value = true
          } else if (scrollTop > 200 && visible.value) {
            visible.value = false
          } else if (scrollTop < 200 && !visible.value) {
            visible.value = true
          }
          oldScrollTop.value = scrollTop
          ticking.value = false
        })
      }
    }

    const toggle = () => {
      emit('toggle')
    }

    onMounted(() => {
      document.addEventListener('scroll', handleScroll, { passive: true })
    })

    onBeforeUnmount(() => {
      document.body.removeEventListener('scroll', handleScroll, true)
    })

    const refreshPage = () => {
      emit('refresh')
    }
    return {
      visible,
      fixedHeader,
      sidebarOpened,
      toggle,
      device,
      isMobile,
      refreshPage
    }
  }
})
</script>
