
import ls from '~/utils/Storage'
import {findMenuItemById} from '~/utils/menu'
import {base_url} from '~/consts/const'
import {LAMBDA_CONFIG, PERMISSIONS, KRUDS, MENU, MENU_LIST} from '~/store/mutation-types'

import SubTopMenu from '~/components/Menu/SubTopMenu.vue'

export default {
  components: {
    SubTopMenu
  },
  computed: {
    menuMode() {
      let menuModeSaved = localStorage.getItem('menuMode')
      if (menuModeSaved) {
        return menuModeSaved
      } else {
        return undefined
      }
    },
    isMobile() {
      return isMobile
    },
    path() {
      return this.$route.fullPath
    }
  },
  data() {
    const kruds = ls.get(KRUDS)
    const permissions = ls.get(PERMISSIONS)
    const menu = ls.get(MENU)
    const menu_list = ls.get(MENU_LIST)
    const LambdaConfig = ls.get(LAMBDA_CONFIG)
    return {
      options: {
        height: '1000px'
      },
      pageType: '',

      property: {
        base_url: base_url,
        withCrudLog: LambdaConfig.withCrudLog,
        withoutHeader: false,
        page_id: null,
        template: 'drawer',
        mode: 'refresh',
        title: '',
        projects_id: null,
        grid: null,
        form: null,
        form_width: 800,
        view_url: null,
        actions: null,
        user_condition: null,
        parent: [],
        permissions: {
          c: false,
          r: false,
          u: false,
          d: false,
        },
      },
      iframeUrl: '',
      iframeTitle: '',
      submenu: [],
      showSub: false,
      cruds: kruds,
      menu: menu,
      menu_list: menu_list,
      permissions: permissions.permissions,
      pageTitle: '',
      subMenuId: '0',
      showNestedMenu: false,
      subTopMenus: [],
      base_url,
    }
  },
  methods: {

    getShowAbleChild(children) {
      let showIndex = children.findIndex(child => this.can(child))

      if (showIndex >= 0) {
        return children[showIndex]
      } else {
        return null
      }
    },

    can(menu) {
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

    getTitle(item) {
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

    // getMenu(menus, id){
    //     let parentIndex =  menus.findIndex(menu => menu.id === id);
    // },

    getPage() {

      if (this.menu_list) {

        let page_index = this.menu_list.findIndex(m => m.id === this.$route.params.menu_id);

        if (page_index === -1) {
          page_index = this.menu_list.findIndex(m => m.url === this.$route.path);
        }

        if (page_index >= 0) {

          const page = this.menu_list[page_index]

          this.pageType = page.link_to
          switch (this.pageType) {
            case 'crud':
              let crudIndex = this.cruds.findIndex(crud => crud.id == page.url)

              if (crudIndex >= 0) {
                this.$route.meta.title = this.cruds[crudIndex].title
                // this.property. = 'canvas'

                this.property.parent = page.parent
                this.property.title = this.cruds[crudIndex].title
                // this.property.withoutHeader = this.withoutHeader;
                this.property.projects_id = this.cruds[crudIndex].projects_id
                this.property.grid = this.cruds[crudIndex].grid
                this.property.form = this.cruds[crudIndex].form
                this.property.edit_id = this.cruds[crudIndex].edit_id
                this.property.template = this.cruds[crudIndex].template
                if (this.cruds[crudIndex].actions) {
                  this.property.actions = this.cruds[crudIndex].actions
                }
                this.property.main_tab_title = this.cruds[crudIndex].main_tab_title
                this.property.form_width = this.cruds[crudIndex].form_width ? this.cruds[crudIndex].form_width : null
                this.property.view_url = this.cruds[crudIndex].view_url
                this.property.permissions.c = this.permissions[page.id].c
                this.property.permissions.r = this.permissions[page.id].r
                this.property.permissions.u = this.permissions[page.id].u
                this.property.permissions.d = this.permissions[page.id].d
                this.property.permissions.gridDeleteConditionJS = this.permissions[page.id].gridDeleteConditionJS
                this.property.permissions.gridEditConditionJS = this.permissions[page.id].gridEditConditionJS
                let user_condition = {}

                if (this.permissions[page.id].formCondition) {
                  user_condition.formCondition = this.permissions[page.id].formCondition
                }
                if (this.permissions[page.id].gridCondition) {
                  user_condition.gridCondition = this.permissions[page.id].gridCondition
                }

                if (user_condition) {
                  this.property.user_condition = user_condition
                }
                this.property.page_id = page.id
              }
              break
            case 'link':

              window.location = this.menu_list[page_index]['url']
              break
            case 'router-link':

              this.$router.push(this.menu_list[page_index]['url'])
              break
            case 'iframe':
              this.iframeUrl = page.url
              this.property.title = page.title
              break
            default:
              break
          }

          // Check if the page has a parent
          if (page.parent?.length >= 1) {
            // Find the index of the parent with link_to = "noActionSubTop"
            const pIndex = page.parent.findIndex(p => p.link_to === "noActionSubTop");

            // If the parent exists, find its children and set them as the subTopMenus
            if (pIndex >= 0) {
              const {children} = findMenuItemById(this.menu, page.parent[pIndex].id);

              if (children?.length) {
                this.subTopMenus = children;
              }
            }
          }
        }
      }

    }
  },
  beforeMount() {

    this.getPage();
  },

}
