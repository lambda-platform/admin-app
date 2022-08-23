<template>
  <svg aria-hidden="true" :width="width" :height="height" :style="{color}">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script>

import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '20px'
    },
    height: {
      type: String,
      default: '20px'
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  }
})
</script>
