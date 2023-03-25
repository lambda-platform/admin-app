<template>
  <SettingItem :title="$t('settingDrawer.theme')">
    <div class="ml-3">
      <a-tooltip
        class=""
        v-for="(item, index) in colorList"
        :key="index"
      >
        <template #title>{{ item.key }}</template>
        <button :style="`background-color: ${item.color}`" @click="changeColor(item.color)" :class="`rounded-full h-7 w-7 m-2.5 dark:m-2.5 ${item.color === primaryColor ? 'active-main-color' : 'main-color'}`" >
        </button>
      </a-tooltip>

      <a-popover title="Өнгө сонгох" overlayClassName="themeColorCustomColor" placement="bottomRight">
        <template #content>
          <ColorPicker @change="changeColor" format="hex" disableHistory disableAlpha />
        </template>
        <button :style="`background-color: ${isCustomColor?primaryColor:'gray'}`"  :class="`rounded-full h-7 w-7  m-2.5 dark:m-2.5 ${isCustomColor ? 'active-main-color' : 'main-color'}`">
        </button>
      </a-popover>
    </div>
  </SettingItem>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { TOGGLE_COLOR } from '~/store/mutation-types'
import { CheckOutlined } from '@ant-design/icons-vue'
import { colorList } from '../settingConfig'
import { updateTheme } from '../updateTheme'
import { primaryColor } from '~/store/useSiteSettings'
import SettingItem from './SettingItem.vue'
import ColorPicker from '~/components/ColorPicker/index.vue'
export default defineComponent({
  components: {
    CheckOutlined,
    SettingItem,
    ColorPicker
  },
  setup() {
    const { state, commit } = useStore()

    const changeColor = (color) => {


      commit(TOGGLE_COLOR, color)


      document.documentElement.style.setProperty(`--primary-color`, color);



      updateTheme(color)
    }

    const colorArr = colorList.map((item) => item.color)
    const isCustomColor = computed(() => {
      return !colorArr.includes(state.app.color)
    })

    return {
      colorList,
      changeColor,
      primaryColor,
      isCustomColor
    }
  }
})
</script>
<style lang="less" scoped>
.setting-drawer-theme-color-colorBlock {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  float: left;
  cursor: pointer;
  margin-right: 8px;
  padding-left: 0px;
  padding-right: 0px;
  text-align: center;
  color: #fff;
  font-weight: 700;

  i {
    font-size: 14px;
  }
}
</style>
