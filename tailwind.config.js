module.exports = {
  mode: "jit",
  content: [
    // "./src/assets/styles/**/*.{css}",
    "./src/components/*.{vue,js}",
    "./src/components/**/*.{vue,js}",
    "./src/components/**/**/*.{vue,js}",
    "./src/components/**/**/**/*.{vue,js}",
    "../../../LAMBDA/vue3/src/modules/**/**/**/*.{vue,js}",
    "../../../LAMBDA/vue3/src/components/**/**/**/*.{vue,js}",
    "../../../LAMBDA/vue3/src/pages/**/**/**/*.{vue,js}",
    "./node_modules/@lambda-platform/lambda-vue/src/modules/**/**/**/*.{vue,js}",
    "./node_modules/@lambda-platform/lambda-vue/src/components/**/**/**/*.{vue,js}",
    "./node_modules/@lambda-platform/lambda-vue/src/pages/**/**/**/*.{vue,js}",
    "./src/layouts/*.vue",
    "./src/pages/*.vue",
    "./src/pages/**/*.vue",
    "./src/plugins/**/*.{js,ts}",
    "./src/*.{vue,js,ts}",
    "./src/nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // 'logo-dark': "url('/assets/images/light.svg')",
        // 'logo-light': "url('/assets/images/dark.svg')",
      },
    },
  },
  darkMode: 'class',
  variants: {
    extend: {
      backgroundImage: ['dark'],
    },
  },
  plugins: [],

};
