<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-input-number
            v-model:value="model.form[model.component]"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            :disabled="meta && meta.disabled ? meta.disabled : false"  />
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"],

};
</script>
