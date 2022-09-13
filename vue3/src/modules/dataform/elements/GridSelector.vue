<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">
        <div class="subform-grid">

            <table border="1">
                <thead>
                <tr>

                    <th v-for="item in meta.GSOption.sourceGridTargetColumns"
                        :key="item.index"
                    >
                        {{ item.label }}
                    </th>
                    <th class="action">...</th>
                </tr>
                </thead>
                <tbody>
                <tr>

                    <td v-for="item in meta.GSOption.sourceGridTargetColumns"
                        :key="item.index"
                    >
                        {{ selectedRow[item.model] }}
                    </td>
                    <td class="action">
                        <a href="javascript:void(0);" class="link link-icon" @click="showAddSourceModal"
                           v-if="!meta.disabled"
                        >
                           <span class="svg-icon ">
                               <inline-svg src="/assets/icons/duotune/general/gen021.svg"/>
                           </span>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>

            <a-modal
                :name="`grid-modal-${meta.GSOption.sourceGridID}`"
                v-model:visible="modal_grid_show"
                class="form-modal"

                width="85%"
                height="85%"
                :title="meta.GSOption.sourceGridModalTitle"
            >
                <section class="form-modal source-grid" style="height: calc(100vh - 300px)">


                    <div class="form-body" v-if="modal_grid_show">

                        <div v-if="meta.GSOption.sourceGridTitle || meta.GSOption.sourceGridDescription"
                             class="source-grid-description"
                        >
                            <h3 v-if="meta.GSOption.sourceGridTitle">
                                {{ meta.GSOption.sourceGridTitle }}
                            </h3>
                            <p v-html="meta.GSOption.sourceGridDescription">

                            </p>
                        </div>
                        <datagrid
                            :schemaID="meta.GSOption.sourceGridID"
                            :url="sourceGridUrl()"
                            :onRowSelect="onRowSelect"
                            :paginate="50"
                            :hasSelection="true"
                            :gridSelector="true"
                            :user_condition="user_condition"
                            :permissions="{
                          c:false,
                          r:true,
                          u:false,
                          d:false,
                      }"
                        />

                    </div>
                </section>
                <template #footer>
                    <div class="add-from-pre-source">
                        <a-button type="success" @click="addFromPreSource"
                                  :disabled="preSource.length === 0"
                                  class="sub-form-add-btn"
                        >
                            <template #icon>
                                <span class="svg-icon ">
                                             <inline-svg
                                                 src="/assets/icons/duotune/general/gen041.svg"
                                             />
                                    </span>
                            </template>
                            &nbsp;&nbsp;Сонгох
                        </a-button>
                    </div>
                </template>
            </a-modal>
        </div>
    </lambda-form-item>
</template>

<script>

import mixin from './_mixin'

export default {
    mixins: [mixin],
    data () {
        return {
            preSource: [],
            modal_grid_show: false,
            user_condition: null,
            selectedRow: {}
        }
    },

    computed: {
        value () {
            return this.model.form[this.model.component]

        },
    },

    watch: {
        value (value, oldValue) {
            if (this.value === null || this.value === 0 || this.value === '') {
                this.selectedRow = {}
            }
            if (value && !oldValue) {
                if (Object.keys(this.selectedRow).length == 0) {
                    this.callRowData()
                }

            }
        }
    },

    mounted () {
        if (this.meta.GSOption.sourceGridUserCondition !== undefined && this.meta.GSOption.sourceGridUserCondition !== null && this.meta.GSOption.sourceGridUserCondition != '') {
            this.user_condition = JSON.parse(this.meta.GSOption.sourceGridUserCondition)
        }
    },

    methods: {
        callRowData () {

            let filter = {}

            filter[this.meta.GSOption.sourceGridValueField] = this.value

            axios.post(`${this.sourceGridUrl()}/lambda/puzzle/grid/data/${this.meta.GSOption.sourceGridID}?&paginate=1&page=1&sort=id&order=desc`, filter).then(({ data }) => {

                if (data.data.length >= 1) {
                    this.selectedRow = data.data[0]
                }

            })
        },
        onRowSelect (rows) {
            this.preSource = rows
        },
        sourceGridUrl () {

            if(window.init){
                if (window.init.microserviceSettings) {
                    let si = window.init.microserviceSettings.findIndex(set => set.project_id == this.meta.GSOption.sourceMicroserviceID)

                    if (si >= 0) {
                        return window.init.microserviceSettings[si].production_url
                    } else {
                        return this.url;
                    }
                } else {
                    return this.url;
                }
            } else {
                return this.url;
            }

        },
        showAddSourceModal () {
            this.modal_grid_show = true
            // this.$modal.show(`grid-modal-${this.meta.GSOption.sourceGridID}`)
        },
        closeSourceModal () {
            this.modal_grid_show = false
            // this.$modal.hide(`grid-modal-${this.meta.GSOption.sourceGridID}`)
        },
        addFromPreSource () {
            this.selectedRow = {}
            if (this.preSource && this.meta.GSOption.sourceGridTargetColumns) {
                if (this.preSource.length >= 1) {
                    this.selectedRow = this.preSource[0];

                    this.model.form[this.model.component] = this.selectedRow[this.meta.GSOption.sourceGridValueField]
                }

            }
            this.closeSourceModal()

        },

    }
}
</script>


