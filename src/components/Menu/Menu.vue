<template>
  <a-menu
    :mode="mode"
    :theme="theme"
    :openKeys="openKeys.value"
    :selectedKeys="selectedKeys"
    @openChange="onOpenChange"
    @select="onSelect"
    :inlineIndent="21"
    :class="mode !== 'horizontal' ? 'SysMenu' : ''"
  >
    <template v-for="m in menu.filter(
        (mItem) => permissions.permissions[mItem.id] && permissions.permissions[mItem.id].show === true
      )" :key="getPath(m)" >
      <RenderSubMenu :item="m" :cruds="kruds" :permissions="permissions.permissions"  :mode="mode" :collapsed="collapsed"  />
    </template>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref, type ComputedRef } from 'vue'

import { KRUDS, MENU, MENU_LIST, PERMISSIONS } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import RenderSubMenu from './RenderSubMenu.vue'
import {getItemPath, getMenu, findMenuItemById} from "~/utils/menu"
import {
  layoutMode,
} from '~/store/useSiteSettings'

export default defineComponent({
  name: 'Menu',
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: { RenderSubMenu },
  setup (props, { emit }) {

    const kruds = ls.get(KRUDS)
    const permissions = ls.get(PERMISSIONS)
    const menu = ls.get(MENU)
    const menu_list = ls.get(MENU_LIST)

    const route = useRoute();


    const openKeys = reactive<any>({ value: [] })
    const selectedKeys = ref<any>([])
    const cachedOpenKeys = reactive<any>({ value: [] })
    const rootSubmenuKeys: ComputedRef<string[]> = computed(() => {
      const keys: string[] = []
      menu.forEach((item: any) => keys.push(getItemPath(item, permissions.permissions)))

      return keys
    });


    const getPath = (item) => {
      return getItemPath(item, permissions.permissions);
    }


    onMounted(() => {
      updateMenu()
    })



    watch(
      () => props.collapsed,
      (val) => {
        if (val) {
          cachedOpenKeys.value = openKeys.value.concat()
        } else {
          openKeys.value = cachedOpenKeys.value
        }
      }
    )


    watch(
      () => route.fullPath,
      (val) => {
        updateMenu()
      }
    )


    const onOpenChange = (openKeysParams) => {

      if (props.mode === 'horizontal') {
        openKeys.value = openKeysParams
        return
      }

      const latestOpenKey: string = openKeysParams.find(
        (key) =>  !openKeys.value.includes(key)
      )
      if (!rootSubmenuKeys.value.includes(latestOpenKey)) {
        openKeys.value = openKeysParams
      } else {
        openKeys.value = latestOpenKey ? [latestOpenKey] : []
      }
    }
    const onSelect = ({ item, key, selectedKeys: selectedKeysParams }) => {
      selectedKeys.value = selectedKeysParams
      emit('select', { item, key, selectedKeys })
    }
    const addSelectKeysForSubTop = () => {
      let page_index = menu_list.findIndex((m => m.id === route.params.menu_id));
      if (page_index >= 0) {
        const page = menu_list[page_index]

        // Check if the page has a parent
        if (page.parent?.length >= 1) {
          // Find the index of the parent with link_to = "noActionSubTop"
          const pIndex = page.parent.findIndex(p => p.link_to === "noActionSubTop");

          // If the parent exists, find its children and set them as the subTopMenus
          if (pIndex >= 0) {
            const { children } = findMenuItemById(menu, page.parent[pIndex].id);
            if (children?.length) {
              selectedKeys.value = [route.path, getPath(children[0])];
            }
          }
        }
      }
    }
    const updateMenu = () => {

      if(menu_list){
        selectedKeys.value = [route.path];
        let parentKeys = [];
        if (props.mode !== 'horizontal') {


          addSelectKeysForSubTop();

          parentKeys = getMenu(menu_list, route.path);
        }

        props.collapsed ? (cachedOpenKeys.value = parentKeys) : (openKeys.value = parentKeys);
      }
    }

    return {
      openKeys,
      selectedKeys,
      onOpenChange,
      onSelect,
      menu,
      permissions,
      kruds,
      getPath,
      layoutMode
    }
  }
})
</script>
<style lang="less">
</style>
