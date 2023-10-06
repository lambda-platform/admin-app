<template>
  <div class="grid grow grid-nogutter module-page container pb-16 px-4 mx-auto">
    <Head>
      <Title>{{title}}</Title>
    </Head>
    <portal to="header-left">
      <div class="flex-grow"></div>
    </portal>
    <div>
      <img :src="`${base_url}${logoDark}`" v-if="darkMode" class="logo-light" :alt="title">
      <img :src="`${base_url}${logo}`"   v-if="!darkMode" class="logo-dark" :alt="title">
      <nav class="module-navigation">
        <div :class="isMobile ? 'grid grid-cols-1  gap-4' : 'grid grid-cols-3  gap-4'">
          <HomeMenuRender v-for="m in menu" :key="m.index"  :item="m" :cruds="kruds" :permissions="permissions.permissions"   />
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import ls from "../../utils/Storage";


import { LAMBDA_CONFIG } from '~/store/mutation-types'
import { KRUDS, MENU, PERMISSIONS } from '~/store/mutation-types'
import HomeMenuRender from '~/components/Menu/HomeMenuRender.vue'
import { darkMode } from '~/store/useSiteSettings'
import {base_url} from "~/consts/const";
import { isMobile } from '~/utils/device'
export default {
  name: 'index',
  components:{
    HomeMenuRender
  },
  setup (props, { emit }) {
    definePageMeta({
      layout: 'module',
    })

    const kruds = ls.get(KRUDS)
    const permissions = ls.get(PERMISSIONS)
    const LambdaConfig = ls.get(LAMBDA_CONFIG)
    const menu = ls.get(MENU)

    return {
      isMobile,
      menu,
      permissions,
      kruds,
      title: LambdaConfig.title,
      logo: LambdaConfig.logo,
      logoDark: LambdaConfig.logo_dark,
      base_url:base_url,
      darkMode
    }
  }
}
</script>

<style scoped>

</style>
