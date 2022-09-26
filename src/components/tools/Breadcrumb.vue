<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadList" :key="item.name">
      <router-link
        v-if="item.name !== name"
        :to="{ path: item.path === '' ? '/' : item.path }"
      >{{ $t(item.meta.title) }}</router-link>
      <span v-else>{{ item.meta.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, onMounted, toRefs } from 'vue'


export default defineComponent({
  setup(props) {
    const route = useRoute()
    const state = reactive<any>({ name: '', breadList: [] })

    const getBreadcrumb = () => {

      state.breadList = []
      // this.breadList.push({name: 'index', path: '/dashboard/', meta: {title: '首页'}})

      state.name = route.name
      route.matched.forEach((item) => {
        // item.name !== 'index' && this.breadList.push(item)
        state.breadList.push(item)
      })
    }

    watch(
      () => route,
      (newVal) => {
        getBreadcrumb()
      }
    )

    onMounted(() => {
      getBreadcrumb()
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
