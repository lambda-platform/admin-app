module.exports = {
  mode: "jit",
  content: [
    // "./src/assets/styles/**/*.{css}",
    "./src/components/*.{vue,js}",
    "./src/components/**/*.{vue,js}",
    "./src/components/**/**/*.{vue,js}",
    "./src/components/**/**/**/*.{vue,js}",
    "./vue3/src/modules/**/**/**/*.{vue,js}",
    "./vue3/src/components/**/**/**/*.{vue,js}",
    "./vue3/src/pages/**/**/**/*.{vue,js}",
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
        'logo-dark': "url('/assets/images/light.svg')",
        'logo-light': "url('/assets/images/dark.svg')",
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
