<template>
  <a class="card p-4 sm:p-5 shadow-md bg-white dark:bg-slate-900 bg-white dark:bg-slate-900 "
     v-if="can(item) && !hasItems(item) && item.link_to === 'link'"
     :href="item.url"
     target="_blank"
  >
    <i v-if="item.icon" :class="item.icon"></i>
    <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    <span>{{ getTitle(item) }}</span>
    <p v-if="children" class="module-menus">
      <span v-for="child in children" :key="child.index">{{getTitle(child, true)}}</span>
    </p>
  </a>
  <router-link :to="item.url" v-else-if="can(item) && !hasItems(item) && item.link_to === 'router-link'" class="card p-4 sm:p-5 shadow-md bg-white dark:bg-slate-900 bg-white dark:bg-slate-900 ">
    <i v-if="item.icon" :class="item.icon"></i>
    <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    <span>{{ getTitle(item) }}</span>
    <p v-if="children" class="module-menus">
      <span v-for="child in children" :key="child.index">{{getTitle(child, true)}}</span>
    </p>
  </router-link>
  <router-link :to="`/admin/p/${item.id}`" class="card p-4 sm:p-5 shadow-md bg-white dark:bg-slate-900 bg-white dark:bg-slate-900 " v-else-if="can(item) && !hasItems(item)">
    <i v-if="item.icon" :class="item.icon"></i>
    <inline-svg class="svg-icon" v-if="item.svg" :src="item.svg"/>
    <span>{{ getTitle(item) }}</span>
    <p v-if="children" class="module-menus">
      <span v-for="(child, index) in children" :key="index"><span v-if="index >= 1">, </span>{{getTitle(child, true)}}</span>
    </p>
  </router-link>
  <HomeMenuRender v-if="can(item) && hasItems(item)" :title="getTitle(item)" :children="item.children" :item="{...item.children[0],  svg:item.svg, icon:item.icon }" :cruds="cruds" :permissions="permissions"   />

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '~/components/SvgIcon/index.vue'
import {

  SettingOutlined,

} from '@ant-design/icons-vue'
import { getItemPath } from '~/utils/menu'

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
  mounted () {
     this.setActive();
  },
  methods: {
    getModuleItem(item){
      if(item.children)
      return item
    },
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
    getTitle (item, isChild) {
      if(this.title && !isChild){
        return this.title
      }
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
