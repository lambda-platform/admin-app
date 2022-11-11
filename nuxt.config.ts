import { resolve } from "path";
import { defineNuxtConfig } from "nuxt";
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
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_dark.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_material.scss',
    '@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_balham.scss',
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

      // viteThemePlugin({
      //   colorVariables: [...getThemeColors(process.env.LAMBDA_PRIMARY_COLOR)],
      // }),
      // Components({
      //   resolvers: [
      //     AntDesignVueResolver(),
      //   ],
      //
      // }),
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
          modifyVars: {
            'primary-color': process.env.LAMBDA_PRIMARY_COLOR,
            'primary-color-dark-theme': process.env.LAMBDA_PRIMARY_COLOR },
          javascriptEnabled: true,
        },
        scss: {
          modifyVars: { 'primary-color': process.env.LAMBDA_PRIMARY_COLOR, 'primary-color-dark-theme': process.env.LAMBDA_PRIMARY_COLOR },
          additionalData: `
          $primary-color: ${process.env.LAMBDA_PRIMARY_COLOR};
          $ag-primary-color: ${process.env.LAMBDA_PRIMARY_COLOR};
          `,
        },
      },
    },
    define: {
      'process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE': '1000000',
      'process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS': '1000000',
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split external library from transpiled code.
            vue: ['vuex', 'portal-vue'],
            ag: ['ag-grid-community', 'ag-grid-enterprise', 'ag-grid-vue3'],
            ant: ['ant-design-vue'],
            leaflet: ['leaflet', 'leaflet-draw', '@turf/turf'],
            common: ['axios', 'jquery'],
            lodash: ['lodash'],
            ck: ['@ckeditor/ckeditor5-vue', '@ckeditor/ckeditor5-build-classic'],
            other: ['swiper', 'vue-awesome-swiper'],
            moment: ['moment'],
            cryptoJs: ['crypto-js'],
            numeral: ['numeral'],
            jsonLogic: ['json-logic-js']
          }
        }
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        // external: ['vue', 'lodash', 'ag-grid-community', 'ag-grid-enterprise', 'axios', 'jquery', 'leaflet', 'ant-design-vue'],
        // output: {
        //   // Provide global variables to use in the UMD build
        //   // for externalized deps
        //   globals: {
        //     vue: 'Vue',
        //     _: 'lodash',
        //   }
        // }
      }
    },
    server: {
      fs: {

        allow: [pathResolve(process.env.LAMBDA_ROOT) + '/'],
      },
    },
  },
  postcss: {
    config:true,
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
