<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <input type="color"  :name="model.component" v-model="model.form[model.component]">
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"],
};
</script>
