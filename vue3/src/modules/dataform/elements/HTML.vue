<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <div class="html-prev" v-html="model.form[model.component]" ></div>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
};
</script>
