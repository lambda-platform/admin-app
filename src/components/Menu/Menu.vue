<template>
  <a-menu
    :mode="mode"
    :theme="theme"
    :openKeys="openKeys.value"
    :selectedKeys="selectedKeys"
    @openChange="onOpenChange"
    @select="onSelect"
    class="SysMenu"
  >
    <template v-for="m in menu" :key="getPath(m)" >
      <RenderSubMenu :item="m" :cruds="kruds" :permissions="permissions.permissions" />
    </template>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref, ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { KRUDS, MENU, MENU_LIST, PERMISSIONS } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import RenderSubMenu from './RenderSubMenu.vue'
import {getItemPath, getMenu} from "~/utils/menu"

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

    const router = useRouter()
    const route = router.currentRoute
    const openKeys = reactive<any>({ value: [] })
    const selectedKeys = ref<any>([])
    const cachedOpenKeys = reactive<any>({ value: [] })
    const rootSubmenuKeys: ComputedRef<string[]> = computed(() => {
      const keys: string[] = []
      menu.forEach((item: any) => keys.push(getItemPath(item)))

      return keys
    });


    const getPath = (item) => {
      return getItemPath(item);
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
      () => route.value,
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
        selectedKeys.value = [router.currentRoute.value.path];
        let parentKeys = getMenu(menu_list, router.currentRoute.value.path);
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
      getPath
    }
  }
})
</script>
<style lang="less">
</style>
