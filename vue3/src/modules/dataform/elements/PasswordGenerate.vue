<template>
    <lambda-form-item :rule="rule" :label=label :name="model.component" :meta="meta">
        <a-input-password v-model:value="model.form[model.component]" password
                          :placeholder="placeholder"
                          :disabled="disabled"
        >
            <template #addonAfter>
                <a-tooltip slot="append">
                    <template #title>{{ lang.Create_a_password }}</template>
                    <span class="svg-icon " @click="generatePass()">
                        <inline-svg
                            src="/assets/icons/duotone/Home/Key.svg"
                        />
                    </span>
                </a-tooltip>
            </template>
        </a-input-password>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
    computed: {
        lang () {
            const labels = ['Create_a_password',
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        },
    },
    methods: {

        generatePass () {
            this.model.form[this.model.component] = Math.floor(
                100000 + Math.random() * 900000
            )
        }
    }
}
</script>
