<template>
    <a-form-item :label=label :rules=rule>
        <i-switch v-model="model.form[model.component]"></i-switch>
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"]
};
</script>
