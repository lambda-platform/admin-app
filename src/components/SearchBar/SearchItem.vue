<template>
  <a-menu-item v-if="!hasItems && isFounded" :key="path" >
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <a
      v-if="item.link_to == 'link'"
      :href="item.url"
      target="_blank"
    >
      <span>{{menuTitle}}</span>
    </a>
    <NuxtLink :to="item.url" v-else-if="item.link_to === 'router-link'">
      <span>{{ menuTitle }}</span>
    </NuxtLink>
    <NuxtLink :to="path" v-else-if="item.link_to === 'noActionSubTop'">
      <span>{{ menuTitle }}</span>
    </NuxtLink>
    <NuxtLink :to="`/admin/p/${item.id}`" v-else>
      <span>{{ menuTitle }} </span>
    </NuxtLink>
  </a-menu-item>
  <a-menu-item-group
    v-if="hasItems"
    :key="path"
    popupClassName="popupSubMenu">
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <template #title><span>{{menuTitle}}</span></template>
    <template v-for="subItem in item.children" :key="subItem.id">
      <SearchItem :item="subItem" :cruds="cruds" :permissions="permissions" :searchValue="searchValue" />
    </template>
  </a-menu-item-group>

</template>
<script >
import { defineComponent } from 'vue'

import {getItemPath, getTitle} from "~/utils/menu"
export default defineComponent({
  name: 'SearchItem',
  props: ['item', 'cruds', 'permissions', 'searchValue'],
  computed: {

    menuTitle() {
      return getTitle(this.item, this.cruds)
    },
    hasItems() {
      if (this.item.link_to === "noActionSubTop") {
        return false
      }
      return this.item && this.item.children !== undefined ? this.item.children.length > 0 : false
    },
    path() {
      return getItemPath(this.item, this.permissions)
    },
    isFounded(){

      if(this.searchValue !== undefined && this.searchValue !== ""){
        if(this.menuTitle.toLowerCase().includes(this.searchValue.toLowerCase())){
          return true
        } else
          return false

      } else {
        return true
      }
    },
  },

})
</script>
