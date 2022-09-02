<template>
    <a-form-item :label=label :rules=rule>
        <input type="date" v-model="model.form[model.component]" class="birthday-picker"
               lang="mn-MN" :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
               :disabled="meta && meta.disabled ? meta.disabled : false"/>
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"],
}
</script>
