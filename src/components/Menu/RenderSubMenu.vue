<template>
  <a-menu-item v-if="can(item) && !hasItems(item)" :key="getPath(item)" >
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
  <a-sub-menu
    v-if="can(item) && hasItems(item)"
    :key="getPath(item)"
    popupClassName="popupSubMenu">
    <template #icon>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    </template>
    <template #title><span>{{getTitle(item)}}</span></template>
    <template v-for="subItem in item.children" :key="subItem.id">
      <RenderSubMenu :item="subItem" :cruds="cruds" :permissions="permissions" />
    </template>
  </a-sub-menu>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {
  QuestionCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined
} from '@ant-design/icons-vue'
import {getItemPath} from "~/utils/menu"
export default defineComponent({
  name: 'RenderSubMenu',
  props: ['item', 'cruds', 'permissions'],
  components: {
    SvgIcon,
    SettingOutlined
  },
  mounted(){

  },
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
          return true
        } else {
          return false
        }
      } else {
        return false
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
