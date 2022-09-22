
// import { replaceStyleVariables } from 'vite-plugin-theme/es/client';
import { getThemeColors, generateColors } from '~/utils/themeUtil'
import { mixLighten, mixDarken, tinycolor } from 'vite-plugin-theme/es/colorUtils';
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"
export async function updateTheme(color: string) {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
    color,
  });

  // var result = await replaceStyleVariables({
  //   colorVariables: [...getThemeColors(color), ...colors],
  //   // colorVariables: [...getThemeColors(color)],
  // });


  ({ scopeName: 'theme-red' })
  //
  // return await replaceStyleVariables({
  //   colorVariables: [...getThemeColors(color), ...colors],
  //   // colorVariables: [...getThemeColors(color)],
  // });
}
