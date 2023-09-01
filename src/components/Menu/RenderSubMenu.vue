<template>
  <a-menu-item v-if="!hasItems && item.link_to !== 'divider'" :key="path">
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <a
      v-if="item.link_to === 'link'"
      :href="item.url"
      target="_blank"
    >
      <span>{{ menuTitle }}</span>
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
  <div v-else-if="!hasItems && item.link_to === 'divider' && mode === 'inline'" class="p-4 text-slate-500">
    {{ collapsed ? strLimit(menuTitle, 4) : menuTitle }}
  </div>
  <a-sub-menu
    v-if="hasItems"
    :key="path"
    popupClassName="popupSubMenu">
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <template #title><span>{{ menuTitle }}</span></template>
    <template v-for="subItem in item.children.filter(mItem=>permissions[mItem.id] && permissions[mItem.id].show === true)" :key="subItem.id">
      <RenderSubMenu :item="subItem" :cruds="cruds" :permissions="permissions"/>
    </template>
  </a-sub-menu>

</template>
<script>
import {defineComponent} from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {getItemPath, getTitle} from "~/utils/menu"

export default defineComponent({
  name: 'RenderSubMenu',
  props: ['item', 'cruds', 'permissions', 'mode', 'collapsed'],
  components: {
    SvgIcon
  },
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
  },
})
</script>
