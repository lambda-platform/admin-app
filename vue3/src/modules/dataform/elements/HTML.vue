<template>
    <a-form-item :label=label :rules=rule>
        <div class="html-prev" v-html="model.form[model.component]" ></div>
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"]
};
</script>
