/**
 *
 * primaryColor - default color, localStorage
 * navTheme - sidebar theme ['dark', 'light']
 * colorWeak - efault color
 * layout - ['sidemenu', 'topmenu']
 * fixedHeader - Header : boolean
 * fixSiderbar - boolean
 * contentWidth - Content Area Layout: Fluid | Fixed
 */
export default {
  navTheme: 'light', // theme for nav menu
  primaryColor:  '#0452a3',
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  colorWeak: false,
  title: 'Lambda',
  storage: {
    namespace: ''
  },
  grayMode: false,
  darkMode: false,
  dynamicBrowserTab: true,
  useAsyncRouter: false
}
