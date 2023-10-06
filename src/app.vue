<template>
  <a-config-provider
      v-if="!loading"
      :locale="mn_MN"
      :theme="{
          algorithm: darkMode ? algorithm : undefined,

          token: {
            colorPrimary: primaryColor,
 colorBgBase:darkMode ? '#030305' : undefined,
 colorText:!darkMode ? 'rgba(0,0,0,0.8)': undefined,

          },
    }"
  >
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </a-config-provider>
  <div class="first-loading-wrp" v-else>
    <h3 style="text-align: center;">{{ title }}</h3>
    <div class="loading-wrp">
      <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">{{ subTitle }}</div>
  </div>
  <LockScreen/>
</template>

<script>
import en_US from 'ant-design-vue/lib/locale/en_US';
import mn_MN from 'ant-design-vue/lib/locale/mn_MN';
import axios from 'axios'
import {
  LAMBDA_CONFIG,
  ACCESS_TOKEN,
  PERMISSIONS,
  MENU,
  KRUDS,
  MENU_LIST,
  USER_INFO,
  MICROSERVICE_SETTINGS
} from '~/store/mutation-types';
import {setDeviceType} from '~/utils/device'
import LockScreen from '~/components/LockScreen/index.vue'
import ls from '~/utils/Storage';
import {getLambdaConfig} from './service/service'
import {clearUserInfo} from './utils/util'
import {createList} from '~/utils/menu'
import {title, subTitle} from '~/consts/const'
import {setupI18n} from "@lambda-platform/lambda-vue/src/locale";
import {i18n, locale} from "~/locale";
import { primaryColor, darkMode } from '~/store/useSiteSettings'
import { theme } from 'ant-design-vue';

const { darkAlgorithm, compactAlgorithm } = theme;
export default {
  components: {LockScreen},
  data() {
    return {
      en_US,
      mn_MN: {
        ...mn_MN, Image: {
          preview: "Харах"
        }
      },
      loading: true,
      title,
      subTitle,
      darkMode,
      primaryColor,
      algorithm: [darkAlgorithm, compactAlgorithm],
    };
  },
  beforeCreate() {
    window.onresize = setDeviceType
    setDeviceType();
  },
  methods: {
    redirectToLogin() {
      clearUserInfo()
      this.loading = false;
      if (this.$route.path !== "/auth/login" && this.$route.path !== "/auth/forgot" && this.$route.path !== "/auth/password-reset") {
        window.location.replace("/auth/login");
      }

    }
  },
  mounted() {

    getLambdaConfig().then((res) => {
      ls.set(LAMBDA_CONFIG, res);

      if (res.default_language !== "mn_MN") {
        setupI18n(locale)
        this.$i18n.locale = res.default_language;
      }

      if (res.microservice_dev) {
        window.microservice_dev = true
      }
      if (ls.get(ACCESS_TOKEN)) {
        axios.get('/get-permissions').then(({data}) => {

          if (data.status) {

            ls.set(PERMISSIONS, data.permission.permissions)
            ls.set(MENU, data.permission.menu)
            ls.set(KRUDS, data.permission.kruds)

            if (data.permission.microserviceSettings) {
              ls.set(MICROSERVICE_SETTINGS, data.permission.microserviceSettings)
            }
            let menuList = createList(data.permission.menu, null, data.permission.kruds)
            ls.set(MENU_LIST, menuList);

            window.init = {
              user: ls.get(USER_INFO),
              firebase_config: res.notify.firebaseConfig,
              microserviceSettings: data.permission.microserviceSettings ? data.permission.microserviceSettings : [],
            }
            this.loading = false;


          } else {
            this.redirectToLogin();
          }
        }).catch(() => {
          this.redirectToLogin();
        })
      } else {
        this.redirectToLogin();
      }
    }).catch(() => {
      this.redirectToLogin();
    });

    if (navigator.platform.indexOf("Win") !== -1) {
      var header = document.querySelector("head");
      var style = document.createElement("style");
      style.innerHTML = '::-webkit-scrollbar-track{background-color:#f1f1f1}::-webkit-scrollbar-thumb{background-color:#888}::-moz-scrollbar-track{background-color:#f1f1f1}::-moz-scrollbar-thumb{background-color:#888}::-ms-scrollbar-track{background-color:#f1f1f1}::-ms-scrollbar-thumb{background-color:#888}::-webkit-scrollbar{width:6px;height:6px}::-moz-scrollbar{width:6px;height:6px}::-ms-scrollbar{width:6px;height:6px}';
      header.appendChild(style);
    }

  }
};
</script>
