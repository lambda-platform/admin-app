<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-input-password v-model:value="model.form[model.component]" password :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label">
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
    </a-form-item>
</template>
<script>


export default {
    props: ['model', 'label', 'rule', 'meta'],
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
