<template>
    <a-form-item :label=label :rules=rule>
        <Checkbox v-model="model.form[model.component]"></Checkbox>
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"]
};
</script>
