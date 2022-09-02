<template>
    <a-divider class="form-divider" v-if="label=='['+model.component+']'"></a-divider>
    <a-divider v-else orientation="left" class="form-divider">{{label}}</a-divider>
</template>

<script>
    export default {
        props: ["model", "label", "rule", "meta"],
    };
</script>
