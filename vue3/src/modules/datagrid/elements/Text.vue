<template>
<!--    <FormItem :label=label>-->
<!--        <Input type="text" v-model="model.form[model.component]" />-->
<!--    </FormItem>-->

    <InputText type="text" v-model="$props.model.form[model.component]" />

</template>

<script>
export default {
    props: ["model", "label"]
};
</script>
