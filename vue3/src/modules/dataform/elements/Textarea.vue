<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-textarea v-model:value="model.form[model.component]"
                 :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
                 :disabled="meta && meta.disabled ? meta.disabled : false"
        />
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"]
};
</script>
