<template>
  <!--placement="bottomRight"
    :autoAdjustOverflow="false"
  :arrowPointAtCenter="true"-->
  <a-popover
    v-model:visible="visible"
    trigger="click"
    :placement="isMobile?'bottom':'bottomRight'"
    overlayClassName="header-search-bar-wrapper"
    :getPopupContainer="getPopupContainer"
    :overlayStyle="{ width: isMobile?'250px':'300px', top: '50px' }"
  >
    <template #content>
      <a-list>
        <a-list-item>
          <a-input-search
            v-model:value="searchValue"
            autofocus
            :placeholder="$t('components.pleaseEnterSearchValue')"
            allowClear
          />
        </a-list-item>
        <a-list-item>
          <a-menu
            @select="onSelect"
            class="SysMenu"
          >
            <template v-for="m in menu" :key="getPath(m)"  >
              <SearchItem :item="m" :cruds="kruds"  :searchValue="searchValue" :permissions="permissions.permissions" />
            </template>
          </a-menu>
        </a-list-item>
      </a-list>
    </template>
    <span class="header-notice" ref="searchRef" style="padding: 0 18px">
        <span class="btn btn-icon">
              <span class="svg-icon">
                      <inline-svg
                        src="/assets/icons/duotune/general/gen021.svg"
                      />
        </span>
    </span>

    </span>
  </a-popover>
</template>

<script lang="ts">
import SearchItem from '~/components/SearchBar/SearchItem.vue'
import { KRUDS, MENU, MENU_LIST, PERMISSIONS } from '~/store/mutation-types'
import { defineComponent, ref } from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { isMobile } from '~/utils/device'
import {getItemPath, getMenu} from "~/utils/menu"
import ls from '~/utils/Storage'
export default defineComponent({
  name: 'SearchBar',
  components: {
    SearchItem,
    BellOutlined
  },
  setup() {
    const loading = ref<boolean>(false)
    const visible = ref<boolean>(false)
    const searchRef = ref(null)
    const searchValue = ref<string>('');
    const kruds = ls.get(KRUDS)
    const permissions = ls.get(PERMISSIONS)
    const menu = ls.get(MENU)
    const menu_list = ls.get(MENU_LIST)
    const getPopupContainer = () => {
      return searchRef.value!.parentElement
    }
    const getPath = (item) => {
      return getItemPath(item);
    }
    const onSelect = () => {
      visible.value = false;
    }


    return {
      loading,
      visible,
      searchValue,
      searchRef,
      getPopupContainer,
      isMobile,
      kruds,
      permissions,
      menu,
      menu_list,
      getPath,
      onSelect,
    }
  }
})
</script>

