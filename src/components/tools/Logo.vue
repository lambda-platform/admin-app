<template>
  <div class="logo">
    <nuxt-link to="/admin">
      <img :src="`${base_url}${logo_dark}`" v-if="darkMode" class="logo-light" :alt="title">
      <img :src="`${base_url}${logo}`"   v-if="!darkMode" class="logo-dark" :alt="title">
      <h1 v-if="showTitle">{{ title }}</h1>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LAMBDA_CONFIG } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import { base_url } from '~/consts/const'
import { darkMode } from '~/store/useSiteSettings'
export default defineComponent({
  name: 'Logo',
  components: {
  },
  props: {

    showTitle: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  setup(props) {

    const LambdaConfig = ls.get(LAMBDA_CONFIG)

    return {
      title: LambdaConfig.title,
      logo: LambdaConfig.logo,
      logo_dark: LambdaConfig.logo_dark,
      base_url:base_url,
      darkMode


    }
  }
});
</script>
