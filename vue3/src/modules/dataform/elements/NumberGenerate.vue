<template>

    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-input-number type="number" v-model:value="model.form[model.component]"
               :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label">
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
    </a-form-item>

</template>

<script>
    export default {
        props: ["model", "label", "rule", "meta"],
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
