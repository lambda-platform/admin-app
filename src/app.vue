<template>
  <a-config-provider
    v-if="!loading"
    :locale="mnLocale"
    :theme="{algorithm: darkMode ? algorithm : undefined,

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
  <div v-else class="flex mx-auto h-screen items-center">
    <loader></loader>
    <LockScreen/>
  </div>
</template>

<script setup>
import {ref, reactive, onBeforeMount} from 'vue';
import {useStore} from 'vuex';
import {useI18n} from 'vue-i18n';
import mn_MN from 'ant-design-vue/lib/locale/mn_MN';
import {
  LAMBDA_CONFIG,
  USER_INFO
} from '~/store/mutation-types';
import {setDeviceType} from '~/utils/device';
import LockScreen from '~/components/LockScreen/index.vue';
import loader from '~/components/common/loader.vue';
import ls from '~/utils/Storage';
import {getLambdaConfig} from './service/service';
import {clearUserInfo} from './utils/util';
import {setupI18n} from '@lambda-platform/lambda-vue/src/locale';
import {primaryColor, darkMode} from '~/store/useSiteSettings';
import {theme} from 'ant-design-vue';
import {setUserPermissions} from '~/authencation/auth';

const {darkAlgorithm, compactAlgorithm} = theme;
const store = useStore();
const {t, locale} = useI18n();

const mnLocale = {
  ...mn_MN,
  Image: {
    preview: 'Харах'
  }
}

const loading = ref(true);
const algorithm = [darkAlgorithm, compactAlgorithm]



// Methods
const clearAndLoadFalse = () => {
  clearUserInfo();
  loading.value = false;
};

const initialize = async () => {
  try {
    const res = await getLambdaConfig();
    ls.set(LAMBDA_CONFIG, res);

    if (res.default_language !== 'mn_MN') {
      setupI18n(locale);
      locale.value = res.default_language;
    }

    if (res.microservice_dev) {
      window.microservice_dev = true;
    }

    window.init = {
      firebase_config:res.notify.firebaseConfig
    }

    if (ls.get(USER_INFO)) {
      await setUserPermissions(store, res.notify.firebaseConfig, ls.get(USER_INFO));
      // await setUserPermissionsWithOrg(store, res.notify.firebaseConfig, selectedOrg !== null ? selectedOrg.org_id : null, userExtraRole !== null ? userExtraRole.id : null);


      loading.value = false;
    } else {
      clearAndLoadFalse();
    }
  } catch (error) {
    console.error(error);
    clearAndLoadFalse();
  }
};

onBeforeMount(() => {
  window.withTimezone = true;
  window.onresize = setDeviceType;
  setDeviceType();
  initialize();
});
</script>
