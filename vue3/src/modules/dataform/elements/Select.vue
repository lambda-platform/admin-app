<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <a-select
                  v-model:value="selectValue"
                  :disabled="disabled"
                  allowClear
                  showSearch
                  :options="options"
                  optionFilterProp="label"
                  optionLabelProp="label"
                  :mode="meta.relation.multiple ? 'multiple' : undefined"
                  @change="changeValue"
                  :placeholder="placeholder"
                  :class="meta.info_url ? 'with-info-caller' : ''"
                 >
<!--            <a-select-option :value="option.value" v-for="option in options" :key="option.key">{{ option.label }}</a-select-option>-->

<!--            <template slot="caret"-->
<!--                      slot-scope="{ toggle }"-->
<!--                      @mousedown.prevent.stop="toggle">-->
<!--                <div class="caret-container">-->
<!--                    <div :class="addAble ? 'multiselect__select addable-caret' : 'multiselect__select'">-->
<!--                    </div>-->
<!--                    <Button v-if="addAble" @click="showAddModal" type="success"-->
<!--                            shape="circle" size="small"-->
<!--                            icon="md-add"></Button>-->
<!--                </div>-->
<!--            </template>-->

        </a-select>

<!--        <div v-if="meta.info_url" class="info-caller">-->
<!--            <Button shape="circle" type="primary"  icon="ios-help-circle" size="small" @click="showInfoModal"></Button>-->
<!--        </div>-->

<!--        <Modal-->
<!--            :min-width="200"-->
<!--            :min-height="100"-->
<!--            :draggable="true"-->
<!--            :footer-hide="true"-->
<!--            :title="label"-->
<!--            width="800"-->
<!--            height="70%"-->
<!--            v-model="modal_show"-->
<!--            v-if="addAble"-->
<!--        >-->
<!--            <section class="add-modal" v-if="modal_show">-->


<!--                <div class="add-body">-->
<!--                    <dataform ref="form" :schemaID="meta.relation.addFrom"-->
<!--                              :editMode="false"-->
<!--                              :onSuccess="onSuccess"-->
<!--                              :url="addFromUrl()"-->
<!--                              :do_render="modal_show"-->
<!--                              :onError="onError"></dataform>-->
<!--                </div>-->
<!--            </section>-->
<!--        </Modal>-->
    </lambda-form-item>
</template>

<script>
import mixin from "./_mixin"
    export default {
        mixins:[mixin],
        computed: {
                lang() {
                    const labels = ['dataNotFound', ];

                    return labels.reduce((obj, key, i) => {
                        obj[key] = this.$t('dataForm.' + labels[i]);
                        return obj;
                    }, {});
                },

        },
        data() {
            return {
                selectValue: null,
                addAble: false,
                modal_show: false,
            }
        },
        methods: {
            changeValue(val) {
                // console.log(val)
                if (val !== undefined && val !== null )  {
                    if (this.meta.relation.multiple === true) {
                        this.model.form[this.model.component] =  val.join(',')
                    } else {
                        if (val === "") {
                            this.model.form[this.model.component] = null;
                        } else  if(!isNaN(val)) {
                            this.model.form[this.model.component] = val*1;
                        } else {
                            this.model.form[this.model.component] = val;
                        }
                    }
                } else {
                    this.model.form[this.model.component] = null;
                }
            },
            addFromUrl(){

                if(window.init.microserviceSettings) {
                    let si = window.init.microserviceSettings.findIndex(set=>set.project_id == this.meta.relation.addFromMicroservice);

                    if(si >= 0){
                        return  window.init.microserviceSettings[si].production_url;
                    } else {
                        return ""
                    }
                } else {
                    return ""
                }
            },
            showAddModal() {
                this.modal_show = true;
            },

            closeModal() {
                this.modal_show = false;
            },
            //Form functions
            onSuccess(val) {
                let label = this.meta.relation.fields.map(field => val[field]);
                label = label.join(', ');
                let newOption = {
                    value: val[this.meta.relation.key],
                    label: label
                };

                if(this.meta.relation.parentFieldOfTable !== "" && this.meta.relation.parentFieldOfForm !== ""){
                    newOption["parent_value"] = val[this.meta.relation.parentFieldOfTable].toString();
                }

                this.relation_data.push(newOption);
                this.closeModal();
            },

            onError(val) {

            },
            showInfoModal(){
                if(this.model.form[this.model.component]){
                    window.showInformationModal(`${this.meta.info_url}${this.model.form[this.model.component]}`, this.meta.placeHolder);
                } else {
                    this.$Message.success(this.lang.dataNotFound);
                }
            },
            search(v){
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
            do_render(value) {
                if (!value) {
                    this.value = null;
                    this.clearAble=false;
                    this.ignoreChange = false;
                    // Vue.set(this.model.form, this.model.component, this.meta.default ? this.meta.default : undefined);
                } else {

                }
            },
        },
        created() {
            if (this.meta.relation.addAble && this.meta.relation.addFrom) {
                this.addAble = true;
            }

        }
    };
</script>
