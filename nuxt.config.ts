import { resolve } from "path";
import { defineNuxtConfig } from "nuxt/config";
// import { viteThemePlugin } from 'vite-plugin-theme';
// import { getThemeColors } from './src/utils/themeUtil'
import { createSvgIconsPlugin }from 'vite-plugin-svg-icons';
// import Components from 'unplugin-vue-components/vite';
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';


const pathResolve = (pathStr: string) => {
  return resolve(__dirname, pathStr);
};


let nuxtAlies = {

}
let viteAlies = [
  {
    find: '@',
    replacement: pathResolve('src') + '/',
  },
  {
    find: 'vue-i18n',
    replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
  }
]
if(process.env.LAMBDA_ROOT !== "@lambda-platform/lambda-vue" && process.env.LAMBDA_ROOT != ""){
  nuxtAlies['@lambda-platform/lambda-vue'] = resolve(__dirname, process.env.LAMBDA_ROOT)

  viteAlies.push({
    find: '@lambda-platform/lambda-vue',
    replacement: pathResolve(process.env.LAMBDA_ROOT) + '/' ,
  })
}
export default defineNuxtConfig({

  alias: nuxtAlies,
  srcDir: "src/",
  app:{

    buildAssetsDir:"lambda_admin/",
    head: {
      meta: [
        { name: "charset", content: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
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
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_light.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_material.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_balham.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_dark.scss',
    '@lambda-platform/lambda-vue/src/modules/krud/scss/style.scss',


  ],
  vite:{
    envPrefix:"LAMBDA_",
    plugins: [
      // splitVendorChunkPlugin(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      //
      // viteThemePlugin({
      //   colorVariables: [...getThemeColors()],
      // }),
      //   Components({
      //       resolvers: [
      //           AntDesignVueResolver({
      //               importStyle: true, // css in js
      //           }),
      //       ],
      //   }),

    ],
    resolve: {
      alias: viteAlies,
      dedupe: [
        'vue'
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          // modifyVars: {
          //   'primary-color': process.env.LAMBDA_PRIMARY_COLOR,
          //   'primary-color-dark-theme': process.env.LAMBDA_PRIMARY_COLOR },
          javascriptEnabled: true,
        },
        // scss: {
        //   modifyVars: { 'primary-color': process.env.LAMBDA_PRIMARY_COLOR, 'primary-color-dark-theme': process.env.LAMBDA_PRIMARY_COLOR },
        //   additionalData: `
        //   $primary-color: ${process.env.LAMBDA_PRIMARY_COLOR};
        //   $ag-primary-color: ${process.env.LAMBDA_PRIMARY_COLOR};
        //   `,
        // },
      },
    },
    define: {
      'process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE': '1000000',
      'process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS': '1000000',
      __COLOR_PLUGIN_OUTPUT_FILE_NAME__: undefined,
      __PROD__: true,
      __COLOR_PLUGIN_OPTIONS__: {},
    },
    build: {
      sourcemap: false,

    },
    server: {
      fs: {

        allow: [pathResolve(process.env.LAMBDA_ROOT) + '/'],
      },
    },
  },
  postcss: {
    plugins:{
      tailwindcss: {},
      autoprefixer: {},
    }
  },


  generate: {
    routes: ["/"],
  },
  ssr: false,
});
