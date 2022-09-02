<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-input-number type="number"
                        v-if="meta.no_format"
               v-model:value="model.form[model.component]"
               :disabled="meta && meta.disabled ? meta.disabled : false" :number="true" />
        <a-input-number
                        v-else
               v-model:value="model.form[model.component]"
                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                        :disabled="meta && meta.disabled ? meta.disabled : false" />
    </a-form-item>
</template>
<script>

    export default {
        props: ["model", "label", "rule", "meta"],

    };
</script>
