<template>
    <Textarea v-model="$props.model.form[model.component]" />
</template>

<script>
export default {
    props: ["model", "label"]
};
</script>
