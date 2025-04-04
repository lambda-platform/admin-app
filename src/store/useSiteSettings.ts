import { computed } from 'vue';
import store from '~/store/index'
const state = store.state
export const userInfo = computed(() => state["app"].userInfo)
export const layoutMode = computed(() => state["app"].layout)
export const navTheme = computed(() => state["app"].theme)
export const primaryColor = computed(() => state["app"].color)
export const colorWeak = computed(() => state["app"].weak)
export const grayMode = computed(() => state["app"].gray)
export const fixedHeader = computed(() => state["app"].fixedHeader)
export const fixSiderbar = computed(() => state["app"].fixSiderbar)
export const fixSidebar = computed(() => state["app"].fixSiderbar)
export const contentWidth = computed(() => state["app"].contentWidth)
export const autoHideHeader = computed(() => state["app"].autoHideHeader)
export const sidebarOpened = computed(() => state["app"].sidebar)
export const multiTab = computed(() => state["app"].multiTab)
export const device = computed(() => state["app"].device)
export const darkMode = computed(() => state["app"].darkMode)
export const lockScreen = computed(() => state["app"].lockScreen)
export const iCanEdit = computed(() => state["processStore"].iCanEdit)
export const isReadOnly = computed(() => state["processStore"].isReadOnly)
export const currentStep = computed(() => state["processStore"].currentStep)

export const orgTypes = computed(() => state["organization"].orgTypes)
export const orgTypeIDS = computed(() => state["organization"].orgTypes.map((orgType: any)=>orgType.id))
export const organizations = computed(() => state["organization"].organizations)
export const organization = computed(() => state["organization"].organization)
export const userExtraRole = computed(() => state["organization"].userExtraRole)
export const userExtraRoles = computed(() => state["organization"].userExtraRoles)

export const isTopMenu = () => layoutMode.value === 'topmenu'
export const isSideMenu = () => !isTopMenu()
