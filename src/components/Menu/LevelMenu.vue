<template>
    <aside class="level-menu">
        <nav>
            <ul>
              <RenderLevelMenu v-for="m in menu" :key="m.index"  :item="m" :cruds="kruds" :permissions="permissions.permissions" :selectMain="selectMain" :selectedMenu="selectedMenu" />
            </ul>
        </nav>

        <div class="sibebar-tools">
            <slot name="sibebar-tools"></slot>
        </div>

        <div class="aside-bottom">
            <slot name="aside-bottom"></slot>
        </div>
    </aside>
  <portal to="level-menu" v-if="subMenus.length >= 1" >
    <div :class="theme === 'dark' ? 'flex-none level-sub-menu bg-slate-900 rounded-md dark' : 'flex-none level-sub-menu bg-white rounded-md'" >
    <h3 class="text-gray-700 dark:text-gray-200"><span>
        {{selectedMTitle}}
      </span></h3>
      <a-menu
        mode="inline"
        :theme="theme"
        :openKeys="openKeys.value"
        :selectedKeys="selectedKeys"
        class="SysMenu rounded-md"
      >
        <template v-for="m in subMenus" :key="getPath(m)" >
          <RenderSubMenu :item="m" :cruds="kruds" :permissions="permissions.permissions"  />
        </template>
      </a-menu>
    </div>

  </portal>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref, ComputedRef } from 'vue'
import { KRUDS, MENU, MENU_LIST, PERMISSIONS } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import RenderLevelMenu from './RenderLevelMenu.vue'
import {getItemPath, getMenu} from "~/utils/menu"
import {
  layoutMode,
} from '~/store/useSiteSettings'
import RenderSubMenu from  '~/components/Menu/RenderSubMenu.vue'

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
  components: { RenderLevelMenu,  RenderSubMenu },
  setup (props, { emit }) {

    const kruds = ls.get(KRUDS)
    const permissions = ls.get(PERMISSIONS)
    const menu = ls.get(MENU)
    const menu_list = ls.get(MENU_LIST)


    const route = useRoute();
    const openKeys = reactive<any>({ value: [] })
    const selectedKeys = ref<any>([])
    const  subMenus = ref<any>([])
    const  selectedMenu = ref<string>("")
    const  selectedMTitle = ref<string>("")
    const cachedOpenKeys = reactive<any>({ value: [] })
    const rootSubmenuKeys: ComputedRef<string[]> = computed(() => {
      const keys: string[] = []
      menu.forEach((item: any) => keys.push(getItemPath(item)))

      return keys
    });


    const getPath = (item) => {
      return getItemPath(item);
    }
    const selectMain = (item, title) =>{

      if(selectedMenu.value === item.id){
        selectedMenu.value = item.id
        if(selectedMTitle.value != ""){
          selectedMTitle.value = ""
          subMenus.value = []
          return
        }

      }

      selectedMenu.value = item.id
      selectedMTitle.value = title
      subMenus.value = item.children;
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
      menu,
      permissions,
      kruds,
      getPath,
      layoutMode,
      subMenus,
      selectMain,
      selectedMenu,
      selectedMTitle
    }
  }
})
</script>
