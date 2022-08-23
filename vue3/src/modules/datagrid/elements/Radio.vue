<template>
    <span>{{ getRadioValue() }}</span>
</template>

<script>


export default {
    methods: {
        getRadioValue() {
            let valueItem = this.params.valueOptions.filter(item => item.value == this.params.value)[0];
            return valueItem.label;
        }
    }
};
</script>
