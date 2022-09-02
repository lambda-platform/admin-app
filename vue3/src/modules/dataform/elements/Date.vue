<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-date-picker
            v-model:value="model.form[this.model.component]"
            mode="date"
           :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
            valueFormat="YYYY-MM-DD"
            :disabled="meta && meta.disabled ? meta.disabled : false"></a-date-picker>
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"],

};
</script>
