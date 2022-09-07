<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <a-input-number type="number" v-model:value="model.form[model.component]"
                        :placeholder="placeholder"
                        :disabled="disabled"
        >
            <template #addonAfter>
                <a-tooltip slot="append">
                    <template #title>{{ lang.createNumber }}</template>
                    <span class="svg-icon " @click="generateNumber()">
                        <inline-svg
                            src="/assets/icons/duotone/Home/Key.svg"
                        />
                    </span>
                </a-tooltip>
            </template>
        </a-input-number>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
        computed: {
            lang() {
                const labels = ['createNumber',
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataForm.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        methods: {
            generateNumber() {
                this.model.form[this.model.component] = Math.floor(
                    1000 + Math.random() * 900000
                );
            }
        }
    };
</script>
