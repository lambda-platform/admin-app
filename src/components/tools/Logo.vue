<template>
  <div class="logo">
    <nuxt-link to="/admin">
      <img :src="`${base_url}${logoDark}`" v-if="darkMode && showTitle" class="logo-light" :alt="title">
      <img :src="`${base_url}${logo}`"   v-if="!darkMode && showTitle" class="logo-dark" :alt="title">
      <img :src="`${base_url}${logoSquireDark}`" v-if="darkMode && !showTitle" class="logo-light" :alt="title">
      <img :src="`${base_url}${logoSquire}`"   v-if="!darkMode && !showTitle" class="logo-dark" :alt="title">
      <h1 v-if="showTitle">{{title}}</h1>
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
      logoDark: LambdaConfig.logo_dark,
      logoSquire: LambdaConfig.logo_squire,
      logoSquireDark: LambdaConfig.logo_squire_dark,
      base_url:base_url,
      darkMode


    }
  }
});
</script>
