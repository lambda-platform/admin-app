<template>
  <a-config-provider :locale="mn_MN" v-if="!loading">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </a-config-provider>
  <div class="first-loading-wrp" v-else>
    <h1 style="text-align: center;">Lambda</h1>
    <div class="loading-wrp">
      <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">Lambda Platform</div>
  </div>
  <LockScreen />
</template>

<script>
import en_US from 'ant-design-vue/lib/locale-provider/en_US';
import mn_MN from 'ant-design-vue/lib/locale-provider/mn_MN';
import axios from 'axios'
import { LAMBDA_CONFIG, ACCESS_TOKEN, PERMISSIONS, MENU, KRUDS, MENU_LIST } from '~/store/mutation-types';
import { setDeviceType } from '~/utils/device'
import LockScreen from '~/components/LockScreen/index.vue'
import ls from '~/utils/Storage';
import { getLambdaConfig } from './service/service'
import { clearUserInfo } from './utils/util'
import { createList } from '~/utils/menu'
export default {
  components: { LockScreen },
  data() {
    return {
      en_US,
      mn_MN:{...mn_MN, Image:{
          preview:"Харах"
        }},
      loading:true
    };
  },
  beforeCreate () {
    window.onresize = setDeviceType
    setDeviceType();
  },
  methods:{
    redirectToLogin(){
      clearUserInfo()
      this.loading = false;
      this.$router.replace("/auth/login");
    }
  },
  mounted () {
    getLambdaConfig().then((res) => {
      ls.set(LAMBDA_CONFIG, res);

      if (ls.get(ACCESS_TOKEN)) {
        axios.get('/get-permissions').then(({ data }) => {

          if (data.status) {



            ls.set(PERMISSIONS, data.permission.permissions)
            ls.set(MENU, data.permission.menu)
            ls.set(KRUDS, data.permission.kruds)
            let menuList = createList(data.permission.menu, null, data.permission.kruds)
            ls.set(MENU_LIST,menuList);
            this.loading = false;
          } else {
            this.redirectToLogin();
          }
        }).catch(()=>{
         this.redirectToLogin();
        })
      } else {
        this.redirectToLogin();
      }
    })

  }
};
</script>
