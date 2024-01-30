<template>
  <SettingItem :title="$t('settingDrawer.layoutSettings')">

    <a-list :split="false">

      <a-list-item>
        <template #actions>
          <a-tooltip>
            <template #title>{{ lang.onlyValid }}</template>
            <a-select
              size="small"
              style="width: 80px"
              :value="contentWidth"
              @change="handleContentWidthChange"
              :disabled="layoutMode === 'sidemenu'"
            >
              <a-select-option value="Fluid">{{lang.fluid}}</a-select-option>
              <a-select-option value="Fixed">{{ lang.fixation}}</a-select-option>
            </a-select>
          </a-tooltip>
        </template>
        <a-list-item-meta>
          <template #title><span >{{ lang.contentWidth}}</span></template>
        </a-list-item-meta>
      </a-list-item>
      <!--  Header -->
      <a-list-item>
        <template #actions>
          <a-switch size="small" :checked="fixedHeader" @change="handleFixedHeader" />
        </template>
        <a-list-item-meta>
          <template #title>{{ lang.fixHeader }}</template>
        </a-list-item-meta>
      </a-list-item>
      <!--  Header -->
      <a-list-item>
        <template #actions>
          <a-switch
            slot="actions"
            size="small"
            :disabled="!fixedHeader"
            :checked="autoHideHeader"
            @change="handleFixedHeaderHidden"
          />
        </template>
        <a-list-item-meta>
          <template #title>
            <a-tooltip placement="left">
              <template #title>{{ lang.configurableWhenFixingHeaders }}</template>
              <div
                :style="{ opacity: !fixedHeader ? '0.5' : '1' }"
              >{{ lang.hideHeaders }}</div>
            </a-tooltip>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item>
        <template #actions>
          <a-switch
            slot="actions"
            size="small"
            :disabled="layoutMode === 'topmenu'"
            :checked="fixSiderbar"
            @change="handleFixSiderbar"
          />
        </template>
        <a-list-item-meta>
          <template
            #title
            :style="{ textDecoration: layoutMode === 'topmenu' ? 'line-through' : 'unset' }"
          >{{ lang.fixedSideMenu }}</template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </SettingItem>
</template>
<script lang="ts">
import { computed, type ComputedRef, defineComponent, watch } from 'vue'
import { useStore } from 'vuex'
// import { i18n } from '~/locale'
import {
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_HEADER_HIDDEN,
  TOGGLE_FIXED_SIDERBAR
} from '~/store/mutation-types'
import {
  contentWidth,
  layoutMode,
  fixedHeader,
  autoHideHeader,
  fixSiderbar
} from '~/store/useSiteSettings'
import { CheckOutlined } from '@ant-design/icons-vue'
import SettingItem from './SettingItem.vue'

export default defineComponent({
  name:'LayoutSettings',
  components: {
    CheckOutlined,
    SettingItem
  },
  setup() {
    const { state, commit,  } = useStore()
    const { proxy } = getCurrentInstance();
    const handleContentWidthChange = (type) => {
      commit(TOGGLE_CONTENT_WIDTH, type)
    }

    const handleFixedHeader = (fixed) => {
      commit(TOGGLE_FIXED_HEADER, fixed)
    }

    const handleFixedHeaderHidden = (autoHidden) => {
      commit(TOGGLE_FIXED_HEADER_HIDDEN, autoHidden)
    }

    const handleFixSiderbar = (fixed) => {
      if (state.app.layoutMode === 'topmenu') {
        commit(TOGGLE_FIXED_SIDERBAR, false)
        return
      }
      commit(TOGGLE_FIXED_SIDERBAR, fixed)
    }
    const lang: ComputedRef<object> = computed(() => {
      const labels = ['contentWidth', 'onlyValid', 'fluid', 'fixation', 'fixHeader', 'configurableWhenFixingHeaders', 'fixedSideMenu', 'hideHeaders'];
      return labels.reduce((obj, key, i) => {
        obj[key] = proxy.$t('settingDrawer.' + labels[i]);
        return obj;
      }, {});
    });

    return {
      handleContentWidthChange,
      contentWidth,
      layoutMode,
      fixedHeader,
      handleFixedHeader,
      autoHideHeader,
      handleFixedHeaderHidden,
      fixSiderbar,
      handleFixSiderbar,
      lang,

    }
  }
})
</script>
