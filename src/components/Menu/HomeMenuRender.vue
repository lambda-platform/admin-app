<template>
  <a class="card p-4 sm:p-5 shadow-md bg-white dark:bg-slate-900 bg-white dark:bg-slate-900 "
     v-if="can(item) && !hasItems(item) && item.link_to === 'link'"
     :href="item.url"
     target="_blank"
  >
    <i v-if="item.icon" :class="item.icon"></i>
    <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    <span>{{ getTitleHome(item) }}</span>
    <p v-if="children" class="module-menus">
      <span v-for="(child, index) in children" :key="child.index"><span v-if="index >= 1">, </span>{{getTitleHome(child, true)}}</span>
    </p>
  </a>
  <NuxtLink :to="item.url" v-else-if="can(item) && !hasItems(item) && item.link_to === 'router-link'" class="card p-4 sm:p-5 shadow-md bg-white dark:bg-slate-900 bg-white dark:bg-slate-900 ">
    <i v-if="item.icon" :class="item.icon"></i>
    <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    <span>{{ getTitleHome(item) }}</span>
    <p v-if="children" class="module-menus">
      <span v-for="(child, index) in children" :key="child.index"><span v-if="index >= 1">, </span>{{getTitleHome(child, true)}}</span>
    </p>
  </NuxtLink>
  <NuxtLink :to="`/admin/p/${item.id}`" class="card p-4 sm:p-5 shadow-md bg-white dark:bg-slate-900 bg-white dark:bg-slate-900 " v-else-if="can(item) && !hasItems(item) && item.link_to !== 'divider'">
    <i v-if="item.icon" :class="item.icon"></i>
    <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    <span>{{ getTitleHome(item) }}</span>
    <p v-if="children" class="module-menus">
      <span v-for="(child, index) in children" :key="index"><span v-if="index >= 1">, </span>{{getTitleHome(child, true)}}</span>
    </p>
  </NuxtLink>
  <HomeMenuRender v-if="can(item) && hasItems(item)" :title="getTitleHome(item)" :children="item.children" :item="findActivehild(item)" :cruds="cruds" :permissions="permissions"   />

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {

  SettingOutlined,

} from '@ant-design/icons-vue'
import { getItemPath, getTitle } from '~/utils/menu'

export default defineComponent({
  name: 'HomeMenuRender',
  props: ['item', 'cruds', 'permissions', 'title', 'children'],
  components: {
    SvgIcon,
    SettingOutlined,

  },
  data () {
    return {

    }
  },

  methods: {
    getModuleItem(item){
      if(item.children)
        return item
    },
    findActivehild(item){
      let index = 0;
      while (!this.can(item.children[index])) {
        index++
      }
      return  {...item.children[index],  svg:item.svg, icon:item.icon }
    },

    getPath (item) {
      return getItemPath(item, this.permissions)
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
    getTitleHome (item, isChild) {
      if(this.title && !isChild){
        return this.title
      }
      return getTitle(item, this.cruds)
    },
    hasItems (item) {
      if(item && item.children !== undefined && item.children.length > 0){
        return item.children.filter(mItem => this.permissions[mItem.id] && this.permissions[mItem.id].show === true).length > 0
      }
      return  false
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
