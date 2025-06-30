import { resolve } from "path";
import { defineNuxtConfig } from "nuxt/config";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";

const pathResolve = (pathStr: string) => {
  return resolve(__dirname, pathStr);
};

let nuxtAliases = {};
let viteAliases = [
  {
    find: "@",
    replacement: pathResolve("src") + "/",
  },
];

if (process.env.LAMBDA_ROOT !== "@lambda-platform/lambda-vue" && process.env.LAMBDA_ROOT !== "") {
  nuxtAliases["@lambda-platform/lambda-vue"] = resolve(__dirname, process.env.LAMBDA_ROOT);
  viteAliases.push({
    find: "@lambda-platform/lambda-vue",
    replacement: pathResolve(process.env.LAMBDA_ROOT) + "/",
  });
}

export default defineNuxtConfig({
  alias: nuxtAliases,
  srcDir: "src/",
  devtools: { enabled: false },
  app: {
    buildAssetsDir: "lambda_admin/",
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      meta: [
        { name: "url", content: process.env.LAMBDA_BASE_URL || "" },
        { name: "type", content: "website" },
        { name: "title", content: process.env.LAMBDA_TITLE || "" },
        { name: "description", content: process.env.LAMBDA_DESCRIPTION || "" },
        {
          name: "image",
          content: process.env.LAMBDA_BASE_URL
            ? `${process.env.LAMBDA_BASE_URL}/assets/images/bg.png`
            : "/assets/images/bg.png",
        },
        { name: "og:url", content: process.env.LAMBDA_BASE_URL || "" },
        { name: "og:type", content: "website" },
        { name: "og:title", content: process.env.LAMBDA_TITLE || "" },
        { name: "og:description", content: process.env.LAMBDA_DESCRIPTION || "" },
        {
          name: "og:image",
          content: process.env.LAMBDA_BASE_URL
            ? `${process.env.LAMBDA_BASE_URL}/assets/images/bg.png`
            : "/assets/images/bg.png",
        },
      ],
      link: [
        { rel: "icon", href: process.env.LAMBDA_FAVICON || "/favicon.ico" },
        { rel: "stylesheet", href: "/assets/lambda/fonts/flaticons/flaticons.css" },
        { rel: "stylesheet", href: "/assets/lambda/fonts/themify/themify-icons.css" },
      ],
      script: [],
    },
  },
  dir: {
    public: resolve(__dirname, "./public/"),
  },
  css: [
    "~/assets/styles/components/loading.css",
    "leaflet-draw/dist/leaflet.draw.css",
    "@clientio/rappid/rappid.css",
    "@lambda-platform/lambda-vue/src/modules/chart/scss/chart.scss",
    "@lambda-platform/lambda-vue/src/modules/datagrid/scss/style.scss",
    "@lambda-platform/lambda-vue/src/modules/dataform/scss/style.scss",
    "@lambda-platform/lambda-vue/src/modules/dataform/scss/_dataform_dark.scss",
    "@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_light.scss",
    "@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_material.scss",
    "@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_balham.scss",
    "@lambda-platform/lambda-vue/src/modules/datagrid/scss/theme/_dark.scss",
    "@lambda-platform/lambda-vue/src/modules/krud/scss/style.scss",
    "@/assets/styles/tailwind.css",
  ],
  vite: {
    envPrefix: "LAMBDA_",
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      tailwindcss(),
      visualizer({
        filename: "bundle-report.html",
        open: false,
      }),
    ],
    resolve: {
      alias: viteAliases,
      dedupe: ["vue"],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    define: {
      "process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE": "1000000",
      "process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS": "1000000",
      __COLOR_PLUGIN_OUTPUT_FILE_NAME__: undefined,
      __PROD__: true,
      __COLOR_PLUGIN_OPTIONS__: {},
    },
    build: {
      sourcemap: false,
      cssMinify: true,
      terserOptions: {
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("ag-grid-community")) return "ag-grid-community";
            if (id.includes("ag-grid-enterprise")) return "ag-grid-enterprise";
            if (id.includes("@syncfusion")) return "syncfusion";
            if (id.includes("@clientio/rappid")) return "@clientio/rappid";
            if (id.includes("lodash")) return "lodash";
            if (id.includes("swiper")) return "swiper";
            if (id.includes("moment")) return "moment";
            if (id.includes("echarts")) return "echarts";
            if (id.includes("ant-design-vue")) return "ant-design-vue";
            if (id.includes("@lottiefiles/dotlottie-web")) return "@lottiefiles/dotlottie-web";
          },
        },
      },
    },
    esbuild: { legalComments: "none" },
    server: {
      fs: {
        allow: [pathResolve(process.env.LAMBDA_ROOT || "") + "/"],
      },
    },
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  generate: {
    routes: ["/"],
  },
  ssr: false,
  compatibilityDate: "2025-06-30",
});
