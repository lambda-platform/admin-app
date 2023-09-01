<template>
  <li v-if="item.link_to !== 'divider'">
    <a
      v-if="item.link_to === 'link'"
      :href="item.url"
      target="_blank"
    >
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ menuTitle }}</span>
    </a>
    <NuxtLink :to="item.url" v-else-if="item.link_to === 'router-link'">
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ menuTitle }}</span>
    </NuxtLink>
    <NuxtLink :to="path" v-else :class="isActive ? 'active' :''">
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ menuTitle }}</span>
    </NuxtLink>
  </li>
  <li v-else-if="!hasItems && item.link_to === 'divider'" class="text-center"><span class="text-slate-500">{{menuTitle}}</span></li>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {

  SettingOutlined,

} from '@ant-design/icons-vue'
import { getItemPath, getTitle } from '~/utils/menu'

export default defineComponent({

  props: ['item', 'cruds', 'permissions', 'isActive'],
  components: {
    SvgIcon,
    SettingOutlined,

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
      // only for level menu, set isLevelMenu = true
      return getItemPath(this.item, this.permissions, true)
    },
  },
  data () {
    return {

    }
  }
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
