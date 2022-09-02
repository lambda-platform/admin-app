<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-time-picker
            v-model:value="model.form[this.model.component]"

            :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
            valueFormat="HH:mm:ss"
            :disabled="meta && meta.disabled ? meta.disabled : false"></a-time-picker>
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"],

};
</script>
