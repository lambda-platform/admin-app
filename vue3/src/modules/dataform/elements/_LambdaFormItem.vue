<template>
    <a-form-item :label=label :name="name">
        <slot  :disabled="meta && meta.disabled ? meta.disabled : false"></slot>
        <template #help v-if="meta.warn !== '' && meta.warn !== undefined">
            {{meta.warn}}
        </template>
    </a-form-item>
</template>

<script>
export default {
    props: ["label", "name", "meta"],
};
</script>
