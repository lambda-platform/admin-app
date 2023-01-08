<template>
  <li v-if="can(item) && !hasItems(item) && item.link_to !== 'divider'">

    <a
      v-if="item.link_to === 'link'"
      :href="item.url"
      target="_blank"
    >
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getMenuTitle(item) }}</span>
    </a>
    <NuxtLink :to="item.url" v-else-if="item.link_to === 'router-link'">
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getMenuTitle(item) }}</span>
    </NuxtLink>
    <NuxtLink :to="`/admin/p/${item.id}`" v-else>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getMenuTitle(item) }}</span>
    </NuxtLink>
  </li>
  <li v-else-if="can(item) && !hasItems(item) && item.link_to === 'divider'" class="text-center"><span class="text-slate-500">{{getMenuTitle(item)}}</span></li>
  <li
    v-if="can(item) && hasItems(item)"

  >
    <a href="javascript:;" @click="selectMain(item, getMenuTitle(item))" :class="selectedMenu === item.id ? 'active' :''">
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getMenuTitle(item) }}</span>
    </a>
  </li>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {

  SettingOutlined,

} from '@ant-design/icons-vue'
import { getItemPath, getTitle } from '~/utils/menu'

export default defineComponent({

  props: ['item', 'cruds', 'permissions', 'selectMain', 'selectedMenu'],
  components: {
    SvgIcon,
    SettingOutlined,

  },
  data () {
    return {

    }
  },
  mounted () {
     this.setActive();
  },
  methods: {

    setActive () {
      if(this.hasItems(this.item)){
        let childIndex = this.item.children.findIndex(c=>c.id === this.$route.params.menu_id);
        if(childIndex >= 0){
          this.selectMain(this.item, this.getMenuTitle(this.item))
        } else {
          this.item.children.forEach(ci=>{
            let childIndex = ci.children.findIndex(c=>c.id === this.$route.params.menu_id);
            if(childIndex >= 0) {
              this.selectMain(this.item, this.getMenuTitle(this.item))
            }
          });
        }
      }
    },
    getPath (item) {
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
