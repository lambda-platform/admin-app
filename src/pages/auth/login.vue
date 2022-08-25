<template>
  <div class="form-content">

    <div class="logo with-text" v-if="lambda.logoText != ''">
      <img :src="lambda.logo" alt="">
      <span>{{ lambda.logoText }}</span>
    </div>
    <div class="logo" v-else>
      <img :src="lambda.logo" alt="">
    </div>
    <h2>{{ lang.loginTitle }}</h2>
    <form id="authForm" method="post" class="login-form">
      <div class="form-element input">
        <input type="text" v-model="credentials.login" :disabled="loading"
               :placeholder="lang.username"
        >
        <span class="icon user"></span>
      </div>
      <div class="form-element input">
        <input type="password" v-model="credentials.password" :disabled="loading"
               :placeholder="lang.password"
        >
        <span class="icon pass"></span>
      </div>
      <div class="form-element">
        <input type="checkbox" class="checkbox" id="remember_me">
        <label for="remember_me">{{ lang.remember }}</label>
      </div>
      <div class="form-element action">
        <a-button type="primary" :loading="loading" @click="onSubmit">{{ lang.login }}</a-button>

        <p>
          <nuxt-link class="forgot" to="/auth/forgot">{{ lang.forgot }}</nuxt-link>
        </p>
      </div>
    </form>

    <div id="msg">
      <span v-if="isSuccess" class="success">{{ lang.loginSuccess }}</span>
      <span v-if="isError" class="error">{{ lang.loginError }}</span>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: 'agent',
})
import axios from 'axios'
import { ACCESS_TOKEN, PERMISSIONS, USER_INFO, LAMBDA_CONFIG, MENU, KRUDS, MENU_LIST } from '~/store/mutation-types'
import ls from '~/utils/Storage'
import { createList } from '~/utils/menu'
import { setToken } from '~/plugins/core/axios'

export default {
  props: ['selectedLang'],
  name: 'login',
  data () {
    const LambdaConfig = ls.get(LAMBDA_CONFIG)
    return {
      loading: false,
      isSuccess: false,
      isError: false,
      credentials: {
        login: null,
        password: null
      },
      lambda: LambdaConfig,
    }
  },
  computed: {
    lang () {
      const labels = ['loginTitle', 'username', 'password', 'remember', 'login', 'forgot', 'loginSuccess', 'loginError']
      return labels.reduce((obj, key, i) => {
        obj[key] = this.$t('user.' + labels[i])
        return obj
      }, {})
    }
  },
  methods: {

    onSubmit () {
      this.isSuccess = false
      this.isError = false
      if (!this.loading) {
        this.loading = true
        axios.post('/auth/login', this.credentials).then(({ data }) => {


          if (data.status) {
            this.isSuccess = true

            ls.set(USER_INFO, {
              ...data.data,
              jwt: undefined
            })
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

                  let path = data.path.replaceAll('#', '')
                  if (path.includes('/p/')) {
                    let paths = path.split('/')

                    let menu_id = paths[paths.length - 1]

                    this.$router.replace('/admin/p/' + menu_id)
                  } else {
                    this.$router.replace(path)
                  }
                  this.loading = false;

                } else {
                  this.isError = true;
                  this.loading = false;
                }
              }).catch(() => {
                this.isError = true;
                this.loading = false;
              })

            }

          } else {
            this.isError = true;
            this.loading = false;
          }

        }).catch(e => {
          setTimeout(() => {
            this.loading = false;
            this.isError = true;
          }, 1000)
        })
      }
    },

  }
}
</script>

<style scoped>

</style>
