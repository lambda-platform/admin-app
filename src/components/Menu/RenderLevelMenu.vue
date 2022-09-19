<template>
  <li v-if="can(item) && !hasItems(item)">

    <a
      v-if="item.link_to === 'link'"
      :href="item.url"
      target="_blank"
    >
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getTitle(item) }}</span>
    </a>
    <router-link :to="item.url" v-else-if="item.link_to === 'router-link'">
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getTitle(item) }}</span>
    </router-link>
    <router-link :to="`/admin/p/${item.id}`" v-else>
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getTitle(item) }}</span>
    </router-link>
  </li>
  <li
    v-if="can(item) && hasItems(item)"

  >
    <a href="javascript:;" @click="selectMain(item, getTitle(item))" :class="selectedMenu === item.id ? 'active' :''">
      <i v-if="item.icon" :class="item.icon"></i>
      <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
      <span>{{ getTitle(item) }}</span>
    </a>
  </li>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {

  SettingOutlined,

} from '@ant-design/icons-vue'
import { getItemPath } from '~/utils/menu'

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
          this.selectMain(this.item, this.getTitle(this.item))
        } else {
          this.item.children.forEach(ci=>{
            let childIndex = ci.children.findIndex(c=>c.id === this.$route.params.menu_id);
            if(childIndex >= 0) {
              this.selectMain(this.item, this.getTitle(this.item))
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
