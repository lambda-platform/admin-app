<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-radio-group v-model:value="model.form[model.component]">
            <a-radio :value="item.value" v-for="item in options" :key=item.index :disabled="disabled">
                <span>{{item.label}}</span>
            </a-radio>
            <a-radio :value="other">
                <span>{{lang.other}}:
                    <a-input type="text" v-model:value="other"
                           :placeholder="lang.pleaseWriting"/>
                </span>
            </a-radio>
        </a-radio-group>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
        methods: {
        },
        data() {
            return {
                other: ''
            }
        },

        computed: {
            lang() {
                const labels = ['pleaseWriting', 'other'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataForm.' + labels[i]);
                    return obj;
                }, {});
            },
            options() {
                this.other=this.model.form[this.model.component];

                if (this.meta.options.length >= 1) {
                    return this.meta.options;
                } else if (this.relations) {
                    if (this.relations[this.meta.relation.table]) {
                        if (this.relations[this.meta.relation.table]['data']) {
                            return this.relations[this.meta.relation.table]['data']
                        } else
                            return [];
                    } else
                        return [];
                }
            }
        }
    };
</script>
