import { ConfigProvider } from 'ant-design-vue'
import tinycolor from "tinycolor2";

export async function updateTheme(color: string) {


  document.documentElement.style.setProperty(`--primary-color`, color);
  document.documentElement.style.setProperty(`--primary-color-lighten`,tinycolor(color).lighten(20).toString());
  document.documentElement.style.setProperty(`--primary-color-lightest`,tinycolor(color).lighten(40).toString());
  document.documentElement.style.setProperty(`--primary-color-darken`,tinycolor(color).darken(20).toString());
  document.documentElement.style.setProperty(`--primary-color-darkest`,tinycolor(color).darken(50).toString());

  const colorState = {
    primaryColor: color,
    // errorColor: '#ff4d4f',
    // warningColor: '#faad14',
    // successColor: '#52c41a',
    // infoColor: '#1890ff',
  };
  ConfigProvider.config({
    theme: colorState,
  });
}
