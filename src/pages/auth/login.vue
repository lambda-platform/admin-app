<template>
  <component :is="renderTheme()" :onSuccess="onSuccess" :selectedLang="selectedLang"
             :lambda="lambda"
  ></component>
</template>
<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';

definePageMeta({
  layout: 'agent',
});

const store = useStore();
import axios from 'axios'
import {

  LAMBDA_CONFIG, USER_INFO
} from '~/store/mutation-types'
import ls from '~/utils/Storage'
import { setToken } from '~/plugins/core/axios'
import { setUserPermissions } from '~/authencation/auth'
import { useRouter } from 'vue-router'
import {useStore} from "vuex";

const props = defineProps(['selectedLang'])
const lambda = ref(ls.get(LAMBDA_CONFIG))
const isSuccess = ref(false)
const router = useRouter()

async function onSuccess(data) {
  if (data.status) {
    isSuccess.value = true

    if(process.dev){
      setToken(data.token)
      localStorage.setItem('token', data.token);
    }
    if (data.oauth) {
      window.location.replace('/oauth2/authorize')
    } else {

      if (data.data.role === 1) {
        window.location.replace(data.path)
      } else {
        await setUserPermissions(store, window.init ? window.init.firebase_config : {}, data.data)
        router.replace('/admin')
      }
    }
  }
}

function renderTheme() {
  return defineAsyncComponent(() => import(`../../../node_modules/@lambda-platform/lambda-vue/src/modules/agent/views/theme/${lambda.value.theme}/auth/login.vue`))
}

onMounted(() => {
  if (ls.get(USER_INFO)) {
    axios.get('/user-permissions')
      .then(({ data }) => {
        if (data.status) {
          router.replace('/admin')
        }
      })
      .catch(e => {
        console.log(e)
      })
  }
})
</script>
