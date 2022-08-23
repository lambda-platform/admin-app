import { reactive } from "vue";
/*
* Plugins
* */

import VueGtag from 'vue-gtag-next'
import PortalVue from 'portal-vue'

// import {i18n} from '~@lambda-platform/lambda-vue/src/locale';

import {installDataGrid} from '@lambda-platform/lambda-vue/src/modules/datagrid';
import {installKrud} from '@lambda-platform/lambda-vue/src/modules/krud';
import { loadLocaleMessages } from '@lambda-platform/lambda-vue/src/locale'

/*
* Local plugins
* */

import apolloProvider from  "./core/apollo"
import store from '../store/index';

import { defineNuxtPlugin } from "#app";
import { initInlineSvg } from "./core/inline-svg";
import { initFilters } from "./core/filters";
import { initAxios } from "./core/axios";

declare interface AppState {
  theme?: string;
  darkTheme?: boolean;
}
import setupDefaultSetting from '~/utils/setupDefaultSetting'
import {i18n, locale} from '~/locale'


export default defineNuxtPlugin(async ({ vueApp: app }) => {

  // app.use(VueGtag, {
  //   property: {
  //     id: 'G-NNSL6DKF5X'
  //   }
  // });

  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(i18n, locale)
  }

  app.use(i18n);

  //
  initAxios();
  initInlineSvg(app);
  initFilters(app);

  /* LAMBDA */
  installKrud(app)
  installDataGrid(app)
  //
  //
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




