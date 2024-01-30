<template>
  <aside class="level-menu">
    <nav>
      <ul>
        <RenderLevelMenu v-for="m in menu.filter(mItem=>permissions.permissions[mItem.id] && permissions.permissions[mItem.id].show === true)" :key="m.index"
                         :item="m" :cruds="kruds" :permissions="permissions.permissions" :selectedMenu="selectedMenu" :isActive="m.id === selectedMenu"/>
      </ul>
    </nav>

    <div class="sibebar-tools">
      <slot name="sibebar-tools"></slot>
    </div>

    <div class="aside-bottom">
      <slot name="aside-bottom"></slot>
    </div>
  </aside>
  <portal to="level-menu" v-if="subMenus.length >= 1">
    <div
      :class="theme === 'dark' ? 'flex-none level-sub-menu bg-slate-900 rounded-md dark' : 'flex-none level-sub-menu bg-white rounded-md'">
      <h3 class="text-gray-700 dark:text-gray-200"><span>
        {{ selectedMTitle }}
      </span></h3>
      <a-menu
        mode="vertical"
        :theme="theme"
        :openKeys="openKeys.value"
        :selectedKeys="selectedKeys"
        class="SysMenu rounded-md"
      >
        <template v-for="m in subMenus.filter(mItem=>permissions.permissions[mItem.id] && permissions.permissions[mItem.id].show === true)"
                  :key="m.index">
          <RenderSubMenu :item="m" :cruds="kruds" :permissions="permissions.permissions"/>
        </template>
      </a-menu>
    </div>

  </portal>
</template>

<script lang="ts">
import {defineComponent, reactive, computed, onMounted, watch, ref, type ComputedRef} from 'vue'
import {KRUDS, MENU, MENU_LIST, PERMISSIONS} from '~/store/mutation-types'
import ls from '~/utils/Storage'
import RenderLevelMenu from './RenderLevelMenu.vue'
import {getItemPath, getMenu} from "~/utils/menu"
import {
  layoutMode,
} from '~/store/useSiteSettings'
import RenderSubMenu from '~/components/Menu/RenderSubMenu.vue'

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
  components: {RenderLevelMenu, RenderSubMenu},
  setup(props, {emit}) {

    const kruds = ls.get(KRUDS)
    const permissions = ls.get(PERMISSIONS)
    const menu = ls.get(MENU)
    const menu_list = ls.get(MENU_LIST)


    const route = useRoute();
    const openKeys = reactive<any>({value: []})
    const selectedKeys = ref<any>([])
    const subMenus = ref<any>([])
    const selectedMenu = ref<string>("")
    const selectedMTitle = ref<string>("")
    const cachedOpenKeys = reactive<any>({value: []})
    const rootSubmenuKeys: ComputedRef<string[]> = computed(() => {
      const keys: string[] = []
      menu.forEach((item: any) => keys.push(getItemPath(item, permissions.permissions)))

      return keys
    });


    const getPath = (item: any) => {
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


    const onOpenChange = (openKeysParams: any[]) => {

      if (props.mode === 'horizontal') {
        openKeys.value = openKeysParams
        return
      }

      const latestOpenKey: string = openKeysParams.find(
        (key) => !openKeys.value.includes(key)
      )
      if (!rootSubmenuKeys.value.includes(latestOpenKey)) {
        openKeys.value = openKeysParams
      } else {
        openKeys.value = latestOpenKey ? [latestOpenKey] : []
      }
    }
    const onSelect = ({item, key, selectedKeys: selectedKeysParams}) => {
      selectedKeys.value = selectedKeysParams
      emit('select', {item, key, selectedKeys})
    }
    const createLevelMenu = () =>{

      let page_index = menu_list.findIndex((m: { id: string | string[] }) => m.id === route.params.menu_id)

      if (page_index >= 0) {
        const page = menu_list[page_index];
        // Check if the page has a parent
        if (page.parent?.length >= 1) {
          selectedMenu.value = page.parent[0].id;
          if (page.parent[0].link_to !== "noActionSubTop") {
            const {children} = findMenuItemById(menu, page.parent[0].id);

            if (children?.length) {

              selectedMTitle.value = page.parent[0].title;
              subMenus.value = children;
              return;
            }
          } else {
            selectedMTitle.value = ""
            subMenus.value = []
          }



        } else {
          selectedMenu.value = page.id
          selectedMTitle.value = ""
          subMenus.value = []
          return;
        }

      }
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

      createLevelMenu()

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
      selectedMenu,
      selectedMTitle
    }
  }
})
</script>
