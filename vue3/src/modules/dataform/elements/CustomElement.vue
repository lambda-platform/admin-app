<template>
    <a-form-item :label=label :rules=rule>
        Custom Element
    </a-form-item>
</template>

<script>

export default {
    props: ["model", "rule", "label", "meta"],

};
</script>
