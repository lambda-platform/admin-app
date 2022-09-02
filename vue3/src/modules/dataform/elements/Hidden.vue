<template>
    <a-form-item :rules=rule :label=label hidden>
        <Input type="hidden" v-model="model.form[model.component]" :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label" />
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"]
};
</script>
