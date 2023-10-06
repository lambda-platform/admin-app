<template>
  <component :is="renderTheme()" :onSuccess="onSuccess" :selectedLang="selectedLang"
             :lambda="lambda"
  ></component>
</template>
<script>

import axios from 'axios'
import {
  ACCESS_TOKEN,
  PERMISSIONS,
  USER_INFO,
  LAMBDA_CONFIG,
  MENU,
  KRUDS,
  MENU_LIST,
  MICROSERVICE_SETTINGS
} from '~/store/mutation-types'
import ls from '~/utils/Storage'
import { createList } from '~/utils/menu'
import { setToken } from '~/plugins/core/axios'
import { defineAsyncComponent } from 'vue'

export default {
  props: ['selectedLang'],
  name: 'login',
  data () {
    const LambdaConfig = ls.get(LAMBDA_CONFIG)
    return {
      lambda: LambdaConfig,

    }
  },
  beforeCreate() {
    definePageMeta({
      layout: 'agent',
    })
  },
  methods: {

    onSuccess (data) {
      if (data.status) {
        this.isSuccess = true

        if (data.oauth) {
          window.location.replace('/oauth2/authorize')
        } else {
          ls.set(USER_INFO, {
            ...data.data,
            jwt: undefined
          })
          window.init = {
            user: data.data,
            firebase_config: this.lambda.notify.firebaseConfig,
            microserviceSettings: [],

          }
          ls.set(ACCESS_TOKEN, data.token, 7 * 24 * 60 * 60 * 1000)
          setToken(data.token)
          if (data.data.role === 1) {
            window.location.replace(data.path)
          } else {

            axios.get('/get-permissions').then((res) => {

              if (res.data.status) {

                ls.set(PERMISSIONS, res.data.permission.permissions)
                ls.set(MENU, res.data.permission.menu)
                ls.set(KRUDS, res.data.permission.kruds)
                let menuList = createList(res.data.permission.menu, null, res.data.permission.kruds)
                ls.set(MENU_LIST, menuList)

                if (res.data.permission.microserviceSettings) {
                  ls.set(MICROSERVICE_SETTINGS, res.data.permission.microserviceSettings)

                  window.init['microserviceSettings'] = res.data.permission.microserviceSettings

                }

                let path = data.path.replaceAll('#', '')
                if (path.includes('/p/')) {
                  let paths = path.split('/')

                  let menu_id = paths[paths.length - 1]

                  // this.$router.replace('/admin/p/' + menu_id)
                  this.$router.replace('/admin')
                } else {
                  // this.$router.replace(path)
                  this.$router.replace('/admin')
                }

              }
            })

          }
        }
      }
    },
    renderTheme () {
      return defineAsyncComponent(() => import(`../../../node_modules/@lambda-platform/lambda-vue/src/modules/agent/views/theme/${this.lambda.theme}/auth/login.vue`))
    }

  },
  mounted() {
    if (ls.get(ACCESS_TOKEN)) {
      axios.get('/get-permissions').then(({ data }) => {
        if (data.status) {
          this.$router.replace('/admin')
        }
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
