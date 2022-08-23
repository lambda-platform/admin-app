<template>
  <portal to="header-left">
        <div class="page-title float-left" >
          <div class="float-left pt-3">
            <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 " >Supplier бизнес</h1>


            <h2 class="text-gray-400 text-xs m-0" >Партнер / Бизнес</h2>
          </div>


        </div>
        <div class="float-left ml-3 ">
            <span class="divider"></span>
          <a-button type="primary" @click="openSide" shape="round">
            <template #icon>
              <span class="anticon align-top" style="vertical-align: top">
                  <inline-svg
                    src="/icons/duotone/General/gen041.svg"
                  />
              </span>
            </template>
            Нэмэх
          </a-button>

        </div>
  </portal>
  <portal to="mobile-page-title">
    <div class="page-title mb-3" >
      <div >
        <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 " >Supplier бизнес</h1>
        <h2 class="text-gray-400 text-xs m-0" >Партнер / Бизнес</h2>
      </div>
    </div>
  </portal>
  <portal to="header-mobile">
    <div class="fixed bottom-14 right-2">
      <a-button type="primary" @click="openSide" shape="circle" size="large">
        <template #icon>
          <span class="settings-btn">
            <inline-svg
              src="/icons/duotone/General/gen041.svg"
            />
          </span>
        </template>
      </a-button>
    </div>
  </portal>
  <div class="card drawer-wrappper">
    <section class="offcanvas-template">
      <div class="crud-page">
        <div class="crud-page-body">

          <div id="drawer-container">
            <div id="left_panel">
              <div :class="openSlidePanel ? 'dg-flex open-drawer' : 'dg-flex'">
                <datagrid v-if="permissions ? permissions.r : false" ref="grid"
                          :url="url"
                          :schemaID="grid"
                          :paginate="50"
                          :fnClone="clone"
                          :fnEdit="edit"
                          :fnQuickEdit="quickEdit"
                          :fnView="view"
                          :actions="$props.actions"
                          :dblClick="$props.dbClickAction"
                          :onRowSelect="$props.onRowSelect"
                          :permissions="permissions"
                          :page_id="page_id"
                          :custom_condition="$props.custom_condition? $props.custom_condition :null"
                          :user_condition="user_condition ? user_condition.gridCondition : null"
                >
                </datagrid>
              </div>
            </div>
            <div id="right_panel" class="ant-drawer" ref="panel" :class="openSlidePanel ? 'show-panel' : 'hide-panel'">
              <div class="resizer"></div>
              <div class="ant-drawer-content-wrapper">

                <div class="ant-drawer-content">
                  <div class="ant-drawer-wrapper-body">
                    <div class="ant-drawer-header">
                      <div class="ant-drawer-header-title" v-if="openSlidePanel">
                        <div class="ant-drawer-title">Supplier бизнес</div>


                        <button aria-label="Close" @click="hideSide" class="ant-drawer-close"><span role="img" aria-label="close" class="anticon anticon-close"><svg focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></span></button>

                      </div>
                    </div>



                    <div class="ant-drawer-body">
                      <TepmForm />
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

  </div>


</template>

<script>

import TepmForm from './TepmForm'

import mixins from './mixin'

export default {
  inheritAttrs: false,
  name: 'Canvas',
  mixins: [mixins],
  data () {
    return {
      dropdownItems: [
        {
          name: 'Option 1',
          code: 'Option 1'
        },
        {
          name: 'Option 2',
          code: 'Option 2'
        },
        {
          name: 'Option 3',
          code: 'Option 3'
        }
      ],
      dropdownItem: null,
      form_width: 800,
      openSlidePanel: false,
      exportLoading: false,
      isResizing: false,
      m_pos: 0,
    }
  },
  components: {

    TepmForm
  },
  methods: {
    hideSide () {
      this.openSlidePanel = false
      this.$refs.panel.style.width = '0px'
      this.$refs.panel.style.flex = `0 0 0px`
    },
    openSide () {
      this.openSlidePanel = true
      let unit = (window.innerWidth - 300) / 100
      let w = parseInt(unit * 40)
      this.$refs.panel.style.width = w + 'px'
      this.$refs.panel.style.flex = `0 0 ${w + 'px'}`
    },
    resize (e) {
      window.getSelection().removeAllRanges()
      const dx = this.m_pos - e.x
      this.m_pos = e.x
      this.$refs.panel.style.width = (parseInt(getComputedStyle(this.$refs.panel, '').width) + dx) + 'px'
      this.$refs.panel.style.flex = `0 0 ${(parseInt(getComputedStyle(this.$refs.panel, '').width) + dx) + 'px'}`
    },
    handleResize () {

      const BORDER_SIZE = 4
      this.$refs.panel.addEventListener('mousedown', (e) => {
        if (e.offsetX < BORDER_SIZE) {
          this.m_pos = e.x
          document.addEventListener('mousemove', this.resize, false)
        }
      }, false)

      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', this.resize, false)
      }, false)

    },
    templateEdit () {
      this.openSide()
    },
    templateOnSuccess () {
      this.hideSide()
    },
  },
  mounted () {
    this.handleResize()

  },
}
</script>

<style lang="scss" scoped>

@import "../scss/drawer";

.offcanvas-template {
  .crud-page {
    height: calc(100vh - 110px) !important;

    .crud-page-body {
      height: 100%;
      margin: 0 !important;

      .dg-flex {
        flex: 1;
        width: 100%;
        overflow: hidden !important;
        height: 100%;
      }

    }
  }
}
.drawer-wrappper{
  width: 100%;
  overflow: hidden;
}


</style>
