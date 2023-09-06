<template>
  <a-menu
    :mode="mode"
    :theme="darkMode ? 'dark' : undefined"
    :openKeys="openKeys.value"
    :selectedKeys="selectedKeys"
    @openChange="onOpenChange"
    @select="onSelect"
    :inlineIndent="21"
    class="sub-top-menu rounded-md"
  >
    <template v-for="m in menu.filter(mItem=>permissions.permissions[mItem.id].show === true)" :key="getPath(m)" >
      <RenderSubMenu :item="m" :cruds="kruds" :permissions="permissions.permissions"  :mode="mode" :collapsed="collapsed" />
    </template>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref, ComputedRef } from 'vue'

import { KRUDS, MENU_LIST, PERMISSIONS } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import RenderSubMenu from './RenderSubMenu.vue'
import {getItemPath, getMenu} from "~/utils/menu"
import {
  layoutMode,
  darkMode,
} from '~/store/useSiteSettings'

export default defineComponent({
  name: 'Menu',
  props: {
    menu: {
      type: Array,
      required: false,
      default: []
    },
    mode: {
      type: String,
      required: false,
      default: 'horizontal'
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
    const menu_list = ls.get(MENU_LIST)

    const route = useRoute();


    const openKeys = reactive<any>({ value: [] })
    const selectedKeys = ref<any>([])
    const cachedOpenKeys = reactive<any>({ value: [] })
    const rootSubmenuKeys: ComputedRef<string[]> = computed(() => {
      const keys: string[] = []
      props.menu.forEach((item: any) => keys.push(getItemPath(item, permissions.permissions)))

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
    const updateMenu = () => {

      if(menu_list){
        selectedKeys.value = [route.path];
        let parentKeys = [];
        if (props.mode !== 'horizontal') {
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
      permissions,
      kruds,
      getPath,
      layoutMode,
      darkMode
    }
  }
})
</script>
<style lang="less">
</style>
