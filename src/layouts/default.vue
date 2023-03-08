<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      width="275"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"

        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @toggle="toggle"
        :device="device"

      ></side-menu>
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu()"
      mode="inline"

      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
      @toggle="toggle"
      :device="device"
    ></side-menu>
    <a-layout
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }"
    >
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content>
        <div class="bg-slate-60 dark:bg-slate-800"
             :style="`height: 100%; padding: ${fixedHeader ? layoutMode === 'levelmenu' ? '20px' : '87px' : '20px'} 24px 20px;`"
        >
          <multi-tab v-if="multiTab"></multi-tab>
          <transition name="page-transition">
            <section >
              <portal-target name="mobile-page-title" v-if="isMobile || layoutMode === 'topmenu'"></portal-target>

              <div class="flex">
                <portal-target name="level-menu">
                </portal-target>
                <div class="w-full">
                  <portal-target name="sub-top-menu">
                  </portal-target>
                  <NuxtPage :key="$route.path"/>
                </div>
              </div>

            </section>
          </transition>
        </div>
      </a-layout-content>

      <!--       layout footer-->
      <a-layout-footer class="">
        <global-footer/>
      </a-layout-footer>

      <setting-drawer></setting-drawer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">

import { defineComponent, ref, computed, watch, onMounted, nextTick } from 'vue'
import { triggerWindowResizeEvent, isMobile, isDesktop } from '~/utils/device'
import emitter from '~/utils/eventBus'
import MultiTab from '~/components/MultiTab/index.vue'
import SideMenu from '~/components/Menu/SideMenu.vue'
import GlobalHeader from '~/components/GlobalHeader/index.vue'
import GlobalFooter from '~/components/GlobalFooter/index.vue'
import SettingDrawer from '~/components/SettingDrawer/index.vue'
import { SET_SIDEBAR_TYPE } from '~/store/mutation-types'

import {
  fixSidebar,
  sidebarOpened,
  multiTab,
  device,
  layoutMode,
  contentWidth,
  fixedHeader,
  navTheme,
  isSideMenu
} from '~/store/useSiteSettings'
import { useStore } from 'vuex'
import ls from '~/utils/Storage'
const can = (menuItem, permissions) => {
  if (permissions[menuItem.id]) {
    if (permissions[menuItem.id].show) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
const getTitle = (item, cruds) => {
  if (item.link_to == 'crud') {
    let crudIndex = cruds.findIndex(crud => crud.id == item.url)
    if (crudIndex >= 0) {
      return cruds[crudIndex].title
    } else {
      return ''
    }
  } else {
    return item.title
  }
}

export default defineComponent({

  name: 'BasicLayout',
  components: {
    MultiTab,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  setup () {
    const route = useRoute();
    const collapsed = ref(false)
    const menus = ref([])
    const store = useStore()

    const contentPaddingLeft = computed(() => {
      if (!fixSidebar.value || isMobile.value) {
        return '0'
      }

      if (sidebarOpened.value) {

        return '256px'
      } else {

        return '70px'
      }

    })
    if(sidebarOpened.value){
      collapsed.value = false
    } else {
      collapsed.value = true;
    }

    watch(
      () => sidebarOpened.value,
      (val) => {
        collapsed.value = !val
      }
    )
    watch(
      () => route.fullPath,
      (val) => {

        if(isMobile.value) {
          drawerClose()
        }
      }
    )
    // const kruds = ls.get(KRUDS)
    // const permissions = ls.get(PERMISSIONS)
    // const menu = ls.get(MENU)

    // menus.value = menu.map(item=>{
    //   let title = getTitle(item, kruds);
    //   let children = [];
    //   if(item.children){
    //     children = item.children.map(child=>{
    //       let title = getTitle(item, kruds);
    //       return {
    //         'path': '/admin/p/d17b6768-7dd2-2b3d-311a-e36ac66c59dc',
    //         'name': title,
    //         'meta': {
    //           'title': title,
    //           'keepAlive': false,
    //           'permission': ['admin'],
    //           'hidden': false
    //         }
    //       }
    //     })
    //   }
    //   return {
    //     'path': '/admin',
    //     'name': title,
    //     'redirect': '/admin/p/d17b6768-7dd2-2b3d-311a-e36ac66c59dc',
    //
    //     'meta': {
    //       'title': title,
    //       'icon': 'bx-analyse',
    //       'keepAlive': true,
    //       'permission': ['admin']
    //     },
    //     'children': children
    //   };
    // })

    onMounted(() => {
      const userAgent = navigator.userAgent
      if (userAgent.indexOf('Edge') > -1) {
        nextTick(() => {
          collapsed.value = !collapsed.value
          setTimeout(() => {
            collapsed.value = !collapsed.value
          }, 16)
        })
      }



    })

    const toggle = () => {
      collapsed.value = !collapsed.value
      store.commit(SET_SIDEBAR_TYPE, !collapsed.value)


      triggerWindowResizeEvent()
    }
    const paddingCalc = () => {
      let left = ''
      if (sidebarOpened.value) {
        left = isDesktop.value ? '256px' : '70px'
      } else {
        left = (isMobile.value && '0') || (fixSidebar.value && '70px') || '0'
      }
      return left
    }

    const drawerClose = () => {
      collapsed.value = false
    }

    // const showRouter = ref(true)
    // const onRefresh = () => {
    //   emitter.all.clear()
    //   showRouter.value = false
    //   nextTick(() => (showRouter.value = true))
    // }

    return {
      collapsed,

      contentPaddingLeft,

      toggle,
      paddingCalc,
      drawerClose,
      multiTab,
      device,
      layoutMode,
      contentWidth,
      fixedHeader,
      navTheme,
      isMobile,
      isSideMenu,

      // showRouter,
      // onRefresh
    }
  }
})
</script>
