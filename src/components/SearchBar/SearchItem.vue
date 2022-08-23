<template>
  <a-menu-item v-if="can(item) && !hasItems(item) && isFounded(item)" :key="getPath(item)" >
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <a
      v-if="item.link_to == 'link'"
      :href="item.url"
      target="_blank"
    >
      <span>{{getTitle(item)}}</span>
    </a>
    <router-link :to="item.url" v-else-if="item.link_to == 'router-link'">
      <span>{{getTitle(item)}}</span>
    </router-link>
    <router-link :to="`/admin/p/${item.id}`" v-else>
      <span>{{getTitle(item)}}</span>
    </router-link>
  </a-menu-item>
  <a-menu-item-group
    v-if="can(item) && hasItems(item)"
    :key="getPath(item)"
    popupClassName="popupSubMenu">
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <template #title><span>{{getTitle(item)}}</span></template>
    <template v-for="subItem in item.children" :key="subItem.id">
      <SearchItem :item="subItem" :cruds="cruds" :permissions="permissions" :searchValue="searchValue" />
    </template>
  </a-menu-item-group>

</template>
<script lang="ts">
import { defineComponent } from 'vue'

import {getItemPath} from "~/utils/menu"
export default defineComponent({
  name: 'SearchItem',
  props: ['item', 'cruds', 'permissions', 'searchValue'],

  methods: {
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
          return true;
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isFounded(menu){

      if(this.searchValue !== undefined && this.searchValue !== ""){
        let title = this.getTitle(menu);

        if(title.toLowerCase().includes(this.searchValue.toLowerCase())){
          return true
        } else
          return false

      } else {
        return true
      }
    },
    getTitle (item) {
      if (item.link_to == 'crud') {
        let crudIndex = this.cruds.findIndex(crud => crud.id == item.url)
        if (crudIndex >= 0) {
          return this.cruds[crudIndex].title
        } else {
          return ''
        }
      } else {
        return item.title
      }
    },
    hasItems (item) {
      return item && item.children !== undefined ? item.children.length > 0 : false
    },
  },
})
</script>
