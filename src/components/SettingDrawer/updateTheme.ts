
import { replaceStyleVariables } from 'vite-plugin-theme/es/client';
import { getThemeColors, generateColors } from '~/utils/themeUtil'
import { mixLighten, mixDarken, tinycolor } from 'vite-plugin-theme/es/colorUtils';

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

  console.log([...getThemeColors(color), ...colors])

  return await replaceStyleVariables({
    colorVariables: [...getThemeColors(color), ...colors],
    // colorVariables: [...getThemeColors(color)],
  });
}
