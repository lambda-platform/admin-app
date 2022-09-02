import { resolve } from "path";
import { defineNuxtConfig } from "nuxt";
import { viteThemePlugin } from 'vite-plugin-theme';
import Components from 'unplugin-vue-components/vite';
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { getThemeColors } from './src/utils/themeUtil'
// import legacy from '@vitejs/plugin-legacy'

import {

  createSvgIconsPlugin }from 'vite-plugin-svg-icons';
import path from 'path';
// import "src/assets/fonts/tt-commons";
const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

// @ts-ignore
export default defineNuxtConfig({
  alias: {
    public: resolve(__dirname, "./public/"),
    '@lambda-platform/lambda-vue' :resolve(__dirname, './vue3')
  },
  target: 'static',
  srcDir: "src/",

  dir: {
    public: resolve(__dirname, "./public/"),
  },

  css: [
    '~/assets/styles/components/loading.css',
    '@/assets/styles/tailwind.css',
    // '~/assets/styles/theme/ant.less',
    // '~/assets/styles/theme/ant_light.less',
    // '~/assets/styles/theme/ant_dark.less',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/style.scss',
    '@lambda-platform/lambda-vue/src/modules/dataform/scss/style.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_material.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_light.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_dark.scss',
    '~/assets/styles/app.scss',
  ],
  // modules: ['@intlify/nuxt3'],
  // // config for `@intlify/nuxt3`
  // intlify: {
  //   localeDir: '../vue3/src/locales', // set the `locales` directory at source directory of your Nuxt application
  //   vueI18n: {
  //     locale: 'mn_MN',
  //   }
  // },
  // modules: ['@nuxtjs/color-mode'],

  vite:{

    server: {
      host: '0.0.0.0'
    },
    plugins: [

      // Components({
      //   dts: true,
      //   resolvers: [AntDesignVueResolver()],
      //   include: [/\.vue$/,/\.tsx$/],
      // }),
      //
      // legacy({
      //   targets: ['defaults', 'not IE 11']
      // }),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteThemePlugin({
        colorVariables: [...getThemeColors()],
      }),

      // legacyPlugin({
      //
      //   targets: [
      //     '> 0.5%',
      //     'last 2 versions',
      //     'Firefox ESR',
      //     'not dead',
      //   ],
      //
      //   polyfills: [
      //     // Empty by default
      //   ],
      //   ignoreBrowserslistConfig: false,
      //   corejs: false,
      // })
    ],
    resolve: {
      alias: [
        // {
        //   find: 'vue-i18n',
        //   replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        // },
        // /@/xxxx => src/xxxx
        // {
        //   find: '@',
        //   replacement: pathResolve('src') + '/',
        // },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
        {
          find: '@lambda-platform/lambda-vue',
          replacement: pathResolve('vue3') + '/' ,
        },

      ],
      dedupe: [
        'vue'
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          // modifyVars: {
          //   'primary-color': '#3471f6',
          // },
          javascriptEnabled: true,
        },
      },
    },
  },
  build: {
    postcss: {
      postcssOptions: require("./postcss.config.js"),
    },
  },

  "charset": "utf-8",
  "viewport": "width=device-width, initial-scale=1",
  meta: {
    meta: [
      { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "description", content: "Хөгжүүлэлтээ LAMBDA-тай хамт илүү хурдан , илүү үр бүтээлтэй гүйцэтгэж, хэрэглэгчийн хэрэгцээ, шаардлагыг хугацаанд нь 100% биелүүлээрэй." },
      { name: "og:url", content: "/assets/images/favicon.png" },
      { name: "og:type", content: "article" },
      { name: "og:title", content: "Lambda Platform" },
      { name: "og:description", content: "Хөгжүүлэлтээ LAMBDA-тай хамт илүү хурдан , илүү үр бүтээлтэй гүйцэтгэж, хэрэглэгчийн хэрэгцээ, шаардлагыг хугацаанд нь 100% биелүүлээрэй." },
      { name: "og:image", content: "/assets/images/favicon.png" },


    ],
    link: [
      { rel: "icon", href: "/assets/images/favicon.png" },
      { rel: 'stylesheet', href: '/assets/lambda/fonts/flaticons/flaticons.css' },
      { rel: 'stylesheet', href: '/assets/lambda/fonts/themify/themify-icons.css' },
    ],
  },
  generate: {
    routes: ["/"],
    subFolders: true,
  },
  ssr: false,
});
