<template>
    <a-form-item :rules=rule :label=label :name="name">
        <slot  :disabled="meta && meta.disabled ? meta.disabled : false"></slot>
        <template #help v-if="meta.warn !== '' && meta.warn !== undefined">
            {{meta.warn}}
        </template>
    </a-form-item>
</template>

<script>
export default {
    props: ["rule", "label", "name", "meta"],
};
</script>
