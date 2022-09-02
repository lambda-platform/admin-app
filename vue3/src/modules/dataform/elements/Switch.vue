<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-switch v-model:checked="model.form[model.component]"  />
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"],

};
</script>
