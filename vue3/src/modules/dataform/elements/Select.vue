<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">
        <a-input-group compact >
            <a-select
                v-model:value="selectValue"
                :disabled="disabled"
                autocomplete="off"
                allowClear
                showSearch
                :options="options"
                optionFilterProp="label"
                optionLabelProp="label"
                :mode="meta.relation.multiple ? 'multiple' : undefined"
                @change="changeValue"
                :placeholder="placeholder"
                :class="selectClass"
            >
            </a-select>
            <a-button @click="showAddModal" v-if="addAble">
                <template #icon>
                    <span class="svg-icon ">
                                 <inline-svg
                                     src="/assets/icons/duotune/general/gen041.svg"
                                 />
                        </span>
                </template>
            </a-button>
            <a-button @click="showInfoModal" v-if="meta.info_url && model.form[model.component]">
                <template #icon>
                    <span class="svg-icon ">
                                 <inline-svg
                                     src="/assets/icons/duotone/Code/Info-circle.svg"
                                 />
                        </span>
                </template>
            </a-button>
        </a-input-group>


        <a-modal
            :min-width="200"
            :min-height="100"
            :draggable="true"
            :footer-hide="true"
            :title="label"
            width="800"
            height="70%"
            v-model:visible="modal_show"
            v-if="addAble"
        >
            <section class="add-modal" v-if="modal_show">
                <div class="add-body">
                    <dataform ref="form" :schemaID="meta.relation.addFrom"
                              :editMode="false"
                              :onSuccess="onSuccess"
                              :url="addFromUrl()"

                              :do_render="modal_show"
                              :onError="onError"
                    ></dataform>
                </div>
            </section>
            <template #footer>
            </template>
        </a-modal>
    </lambda-form-item>
</template>

<script>
import mixin from './_mixin'
import { Modal } from 'ant-design-vue'
export default {
    mixins: [mixin],
    components:{
        "a-modal": Modal,
    },
    computed: {
        lang () {
            const labels = ['dataNotFound',]

            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        },
        addAble () {
            return this.meta.relation.addAble && this.meta.relation.addFrom
        },
        selectClass () {
            let className = ''
            if (this.meta.info_url) {

                if (this.model.form[this.model.component]) {
                    className = className + ' with-info-caller '
                }

            }
            if (this.addAble) {

                className = className + ' addable-select '
            }

            return className
        },

    },
    data () {
        return {
            selectValue: null,

            modal_show: false,
        }
    },
    methods: {

        changeValue (val) {
            // console.log(val)
            if (val !== undefined && val !== null) {
                if (this.meta.relation.multiple === true) {
                    this.model.form[this.model.component] = val.join(',')
                } else {
                    if (val === '') {
                        this.model.form[this.model.component] = null
                    } else if (!isNaN(val)) {
                        this.model.form[this.model.component] = val * 1
                    } else {
                        this.model.form[this.model.component] = val
                    }
                }
            } else {
                this.model.form[this.model.component] = null
            }
        },
        addFromUrl () {

            if (window.init) {
                if (window.init.microserviceSettings) {
                    let si = window.init.microserviceSettings.findIndex(set => set.project_id == this.meta.relation.addFromMicroservice)

                    if (si >= 0) {
                        return window.init.microserviceSettings[si].production_url
                    } else {
                        return this.url
                    }
                } else {
                    return this.url
                }
            } else {
                return this.url
            }

        },
        showAddModal () {
            this.modal_show = true
        },

        closeModal () {
            this.modal_show = false
        },
        //Form functions
        onSuccess (val) {
            let label = this.meta.relation.fields.map(field => val[field])
            label = label.join(', ')
            let newOption = {
                value: val[this.meta.relation.key],
                label: label
            }

            if (this.meta.relation.parentFieldOfTable !== '' && this.meta.relation.parentFieldOfForm !== '') {
                newOption['parent_value'] = val[this.meta.relation.parentFieldOfTable].toString()
            }

            this.relation_data(this.meta).push(newOption)
            this.closeModal()
        },

        onError (val) {

        },
        showInfoModal () {
            if (this.model.form[this.model.component]) {
                window.showInformationModal(`${this.meta.info_url}${this.model.form[this.model.component]}`, this.meta.placeHolder)
            }
        },
        search (v) {
            console.log(v)
        },
        initialValue (options) {
            if (this.model.form[this.model.component]) {

                if (this.model.form[this.meta.relation.parentFieldOfForm]) {
                    let foundIndex = options.findIndex(option => option.value === this.model.form[this.model.component])
                    if (foundIndex >= 0) {
                        this.setSelectValue()
                    } else {
                        this.setNull()
                    }
                } else {
                    this.setSelectValue()
                }
            } else {
                this.setNull()
            }
        },
        setSelectValue () {
            if (this.meta.relation.multiple === true && this.model.form[this.model.component] !== '') {
                this.selectValue = this.model.form[this.model.component].split(',').map(v => {
                    if (!isNaN(v)) {
                        return v * 1
                    } else {
                        return v
                    }
                })
            } else {

                this.selectValue = this.model.form[this.model.component]
            }
        },
        setNull () {
            if (this.meta.relation.multiple === true) {
                this.selectValue = []
            } else {
                this.selectValue = null
            }
        }
    },
    watch: {
        do_render (value) {
            if (!value) {
                this.value = null
                this.clearAble = false
                this.ignoreChange = false
            } else {

            }
        },
    },

}
</script>
