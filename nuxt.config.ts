import { resolve } from "path";
import { defineNuxtConfig } from "nuxt";
// import { viteThemePlugin } from 'vite-plugin-theme';
import { getThemeColors } from './src/utils/themeUtil'
import { createSvgIconsPlugin }from 'vite-plugin-svg-icons';
import path from 'path';

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
  app:{
    buildAssetsDir:"lambda_admin",
  },
  dir: {
    public: resolve(__dirname, "./public/"),
  },

  css: [
    '~/assets/styles/components/loading.css',
    '@/assets/styles/tailwind.css',
    "leaflet-draw/dist/leaflet.draw.css",
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/style.scss',
    '@lambda-platform/lambda-vue/src/modules/dataform/scss/style.scss',
    '@lambda-platform/lambda-vue/src/modules/dataform/scss/_dataform_dark.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_material.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_light.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_dark.scss',
    '~/assets/styles/app.scss',
  ],
  vite:{
    envPrefix:"LAMBDA_",
    server: {
      host: '0.0.0.0'
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // viteThemePlugin({
      //   colorVariables: [...getThemeColors()],
      // }),
    ],
    resolve: {
      alias: [
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
      { name: "description", content: process.env.LAMBDA_DESCRIPTION  },
      { name: "og:url", content: process.env.LAMBDA_FAVICON },
      { name: "og:type", content: "article" },
      { name: "og:title", content: process.env.LAMBDA_TITLE },
      { name: "og:description", content: process.env.LAMBDA_DESCRIPTION },
      { name: "og:image", content: process.env.LAMBDA_FAVICON},
    ],
    link: [
      { rel: "icon", href: process.env.LAMBDA_FAVICON },
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
