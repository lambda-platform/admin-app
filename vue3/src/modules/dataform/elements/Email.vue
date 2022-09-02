<template>
    <a-form-item :label=label :rules=rule>
        <Input type="email" v-model="model.form[model.component]" :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label" />
    </a-form-item>
</template>

<script>
export default {
  props: ["model", "label", "rule", "meta"]
};
</script>
