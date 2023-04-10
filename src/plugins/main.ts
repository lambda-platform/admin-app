import { reactive } from "vue";
import { customElementList } from '~/dataform_custom/index.js'
import { gridCustomElementList } from '~/datagrid_custom/index.js'
/*
* Plugins
* */

import VueGtag from 'vue-gtag-next'
import PortalVue from 'portal-vue'
// import {i18n} from '~@lambda-platform/lambda-vue/src/locale';

import {installDataGrid} from '@lambda-platform/lambda-vue/src/modules/datagrid';
import {installDataForm} from '@lambda-platform/lambda-vue/src/modules/dataform';
import {installNotification} from '@lambda-platform/lambda-vue/src/modules/notify';
import {installKrud} from '@lambda-platform/lambda-vue/src/modules/krud';
import { loadLocaleMessages } from '@lambda-platform/lambda-vue/src/locale'

import dayjs from 'dayjs/esm/index'
import advancedFormat from 'dayjs/esm/plugin/advancedFormat/index'
import customParseFormat from 'dayjs/esm/plugin/customParseFormat/index'
import localeData from 'dayjs/esm/plugin/localeData/index'
import weekday from 'dayjs/esm/plugin/weekday/index'
import weekOfYear from 'dayjs/esm/plugin/weekOfYear/index'
import weekYear from 'dayjs/esm/plugin/weekYear/index'
// import 'dayjs/locale/mn'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

/*
* Local plugins
* */

import apolloProvider from  "./core/apollo"
import store from '../store/index';

import { defineNuxtPlugin } from "#app";
import { initInlineSvg } from "./core/inline-svg";
import { initFilters } from "./core/filters";
import { initAxios } from "./core/axios";
import * as short from "vue3-shortkey/src/index.js"
declare interface AppState {
  theme?: string;
  darkTheme?: boolean;
}
import setupDefaultSetting from '~/utils/setupDefaultSetting'
import {i18n, locale} from '~/locale'
import Antd from 'ant-design-vue';

import '~/assets/styles/theme/ant_light.less';
import '~/assets/styles/theme/ant_dark.less';
import '~/assets/styles/app.scss';
// import '~/assets/styles/components/loading.css';
// import   '@/assets/styles/tailwind.css'
//   // '~/assets/styles/theme/ant.less',
//   // '~/assets/styles/theme/ant_light.less',
//   // '~/assets/styles/theme/ant_dark.less',
// import   '@lambda-platform/lambda-vue/src/modules/datagrid/scss/style.scss';
// import   '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_material.scss';
// import   '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_light.scss';
// import   '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_dark.scss';
// import  '~/assets/styles/app.scss';
//

export default defineNuxtPlugin(async ({ vueApp: app }) => {


  // app.use(VueGtag, {
  //   property: {
  //     id: 'G-NNSL6DKF5X'
  //   }
  // });

  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(i18n, locale)
  }
  app.use(Antd);
  app.use(i18n);
  app.config.globalProperties.$customElementList = customElementList
  app.config.globalProperties.$customDataGridElementList = gridCustomElementList
  //
  initAxios();
  initInlineSvg(app);
  initFilters(app);

  /* LAMBDA */
  installKrud(app)
  app.provide('customElementList', customElementList)
  installDataForm(app)
  installDataGrid(app)
  installNotification(app)
  //
  //
  short.install(app)

  app.use(store);

  app.use(apolloProvider);

  app.use(PortalVue);


  setupDefaultSetting();

  return {
    provide: {
      appState: reactive({
        theme: "lara-light-indigo",
        darkTheme: false,
      }) as AppState,
    },
  };
});

declare module "#app" {
  interface NuxtApp {
    $appState: AppState;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $appState: AppState;
  }
}

export {};




