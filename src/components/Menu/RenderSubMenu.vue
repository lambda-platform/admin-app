<template>
  <a-menu-item v-if="can(item) && !hasItems(item) && item.link_to !== 'divider'" :key="getPath(item)" >
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <a
      v-if="item.link_to === 'link'"
      :href="item.url"
      target="_blank"
    >
      <span>{{getMenuTitle(item)}}</span>
    </a>
    <NuxtLink :to="item.url" v-else-if="item.link_to === 'router-link'">
      <span>{{getMenuTitle(item)}}</span>
    </NuxtLink>
    <NuxtLink :to="`/admin/p/${item.id}`" v-else>
      <span>{{getMenuTitle(item)}}</span>
    </NuxtLink>
  </a-menu-item>
  <div v-else-if="can(item) && !hasItems(item) && item.link_to === 'divider' && mode === 'inline'" class="p-4 text-slate-500">{{collapsed ? strLimit(getMenuTitle(item), 4) : getMenuTitle(item)}}</div>
  <a-sub-menu
    v-if="can(item) && hasItems(item)"
    :key="getPath(item)"
    popupClassName="popupSubMenu">
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <template #title><span>{{getMenuTitle(item)}}</span></template>
    <template v-for="subItem in item.children" :key="subItem.id">
      <RenderSubMenu :item="subItem" :cruds="cruds" :permissions="permissions" />
    </template>
  </a-sub-menu>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {getItemPath, getTitle} from "~/utils/menu"

export default defineComponent({
  name: 'RenderSubMenu',
  props: ['item', 'cruds', 'permissions', 'mode', 'collapsed'],
  components: {
    SvgIcon
  },
  mounted(){

  },
  methods: {
    strLimit: (value, size) => {

      if (!value) return '';
      value = value.toString();

      if (value.length <= size) {
        return value;
      }
      return value.substr(0, size) + '...';
    },
    getPath(item){
      return getItemPath(item)
    },
    findActiveMenu (menus, prefix, parentID) {
      menus.forEach(menu => {
        if (menu.children) {
          if (menu.children.length >= 1) {
            this.findActiveMenu(menu.children, `${prefix}/${menu.id}`, `${parentID}${menu.id}`)
          } else {
            this.setActiveMenu(menu, prefix, parentID)
          }
        } else {
          this.setActiveMenu(menu, prefix, parentID)
        }
      })
    },
    setActiveMenu (menu, prefix, parentID) {
      if ((menu.link_to == 'iframe' || menu.link_to == 'crud') && this.cleanPath == `${prefix}/${menu.id}` && parentID != '') {
        this.menu_open = [parentID]
      }
    },
    can (menu) {
      if (this.permissions[menu.id]) {
        if (this.permissions[menu.id].show) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    getMenuTitle (item) {
      return getTitle(item, this.cruds)
    },
    hasItems (item) {
      return item && item.children !== undefined ? item.children.length > 0 : false
    },
  },
})
</script>
<style lang="less" scoped>
.menuName {
  svg,
  span {
    vertical-align: middle;
  }

  svg {
    margin-right: 10px;
  }
}
</style>
