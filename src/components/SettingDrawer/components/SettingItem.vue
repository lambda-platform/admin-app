<template>
  <div class="setting-drawer-index-item">
    <h3 class="setting-drawer-index-title">{{title}}</h3>
    <slot></slot>
    <a-divider v-if="divider"/>
  </div>
</template>

<script>
export default {
  name: 'SettingItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    divider: {
      type: Boolean,
      default: true
    }
  }
}
</script>
