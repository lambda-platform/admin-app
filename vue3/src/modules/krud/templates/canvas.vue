<template>
    <div class="card drawer-wrappper">
        <portal to="header-left">
            <div class="page-title float-left">
                <div class="float-left pt-3">
                    <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">{{ title }}</h1>
                    <h2 class="text-gray-400 text-xs m-0">
                        <span v-for="(p, index) in parent" :key="p.index">
                            <span v-if="index >= 1"> / </span>{{ p.title }}
                        </span>
                    </h2>
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
            <div class="page-title mb-3">
                <div>
                    <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">{{ title }}</h1>
                    <h2 class="text-gray-400 text-xs m-0">
                         <span v-for="(p, index) in parent" :key="p.index">
                            <span v-if="index >= 1"> / </span>{{ p.title }}
                        </span>
                    </h2>
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
        <section class="offcanvas-template">
            <div class="crud-page">
                <div class="crud-page-body">

                    <div id="drawer-container">
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
                </div>

            </div>
        </section>
        <a-drawer
            v-model:visible="openSlidePanel"
            class="custom-class"
            :maskClosable="false"
            title="Supplier бизнес"
            placement="right"
        >
            <TepmForm/>
        </a-drawer>
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
            // this.$refs.panel.style.width = '0px'
            // this.$refs.panel.style.flex = `0 0 0px`
        },
        openSide () {
            this.openSlidePanel = true
            // let unit = (window.innerWidth - 300) / 100
            // let w = parseInt(unit * 40)
            // this.$refs.panel.style.width = w + 'px'
            // this.$refs.panel.style.flex = `0 0 ${w + 'px'}`
        },

        templateEdit () {
            this.openSide()
        },
        templateOnSuccess () {
            this.hideSide()
        },
    },
    mounted () {

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

.drawer-wrappper {
    width: 100%;
    overflow: hidden;
}


</style>
