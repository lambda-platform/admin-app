<template>
  <lambda-form-item :label=label :name="model.component" :meta="meta">
    <a-input v-model:value="model.form[model.component]"
             :placeholder="placeholder"
             :disabled="disabled"
    >
      <template #prefix>
        <user-outlined type="user" />
      </template>
      <template #suffix>
        <a-tooltip :title="label">
          <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
        </a-tooltip>
      </template>
    </a-input>
  </lambda-form-item>
</template>

<script>
import mixin from '@lambda-platform/lambda-vue/src/modules/dataform/elements/_mixin';
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
export default {
  mixins: [mixin],
  components: {
    UserOutlined,
    InfoCircleOutlined,
  },
}
</script>

<style scoped>

</style>
