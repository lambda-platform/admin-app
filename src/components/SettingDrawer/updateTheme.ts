import { ConfigProvider } from 'ant-design-vue'

export async function updateTheme(color: string) {

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
