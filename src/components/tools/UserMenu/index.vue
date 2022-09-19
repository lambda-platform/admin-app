<template>
  <SearchBar class="action"/>
  <notice-icon class="action"/>
  <DarkLightMode class="action" v-if="!isMobile"/>
  <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <span class="link link-icon ">
            <span class="svg-icon ">
                      <inline-svg
                        src="/assets/icons/duotone/Interface/User.svg"
                      />
            </span>
          </span>
          <span class="nickname text-gray-700 dark:text-gray-200" v-if="!isMobile && layoutMode !== 'topmenu'">&nbsp;&nbsp;{{
              nickname
            }}</span>
        </span>
    <template #overlay>
      <a-menu class="user-dropdown-menu-wrapper">
        <a-menu-item key="1"
        >
          <router-link
            class="link link-icon "
            to="/admin/profile"

          >
                <span class="svg-icon">

                      <inline-svg
                        src="/assets/icons/duotone/Interface/User.svg"
                      />
                </span>&nbsp;&nbsp;
            <span>{{ $t('appAdmin.profile') }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2"
        >
          <router-link
            class="link link-icon "
            to="/admin/change-password"

          >
                <span class="svg-icon">

                      <inline-svg
                        src="/assets/icons/duotone/Home/Key.svg"
                      />
                </span>&nbsp;&nbsp;
            <span>{{ $t('appAdmin.changePassword') }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3"
        >
          <a
            class="link link-icon "
            href="https://lambda-platform.github.io/"
            target="_blank"
          >
                <span class="svg-icon">

                      <inline-svg
                        src="/assets/icons/duotone/Home/Book.svg"
                      />
                </span>&nbsp;&nbsp;
            <span>{{ $t('appAdmin.manual') }}</span>
          </a>
        </a-menu-item>
        <a-menu-item key="4" @click="showSystemSetting">
          <a class="link link-icon ">
                 <span class="svg-icon ">
                      <inline-svg
                        src="/assets/icons/duotune/general/gen019.svg"
                      />
                  </span>&nbsp;&nbsp;
            <span>{{ $t('userMenu.systemConfig') }}</span>
          </a>
        </a-menu-item>
        <a-menu-item key="5" @click="onLockScreen">
          <a class="link link-icon ">
                 <span class="svg-icon ">
                      <inline-svg
                        src="/assets/icons/duotone/Interface/Lock.svg"
                      />
                  </span>&nbsp;&nbsp;
            <span>{{ $t('userMenu.lockScreen') }}</span>
          </a>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="6">
          <Logout/>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <SelectLang :class="theme" class="action"/>
  <div class="action" v-if="!isMobile">
         <span class="link link-icon " @click="showSystemSetting">
            <span class="svg-icon ">
                      <inline-svg
                        src="/assets/icons/duotune/general/gen019.svg"
                      />
            </span>
          </span>
  </div>
  <div class="fixed bottom-0 right-2" v-if="isMobile">
    <a-button type="primary" shape="circle" @click="showSystemSetting" size="large">
      <template #icon>
          <span class="settings-btn">
            <inline-svg
              src="/assets/icons/duotune/general/gen019.svg"
            />
          </span>
      </template>
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NoticeIcon from '~/components/NoticeIcon/index.vue'
import SearchBar from '~/components/SearchBar/index.vue'
import DarkLightMode from '~/components/tools/DarkLightMode.vue'
import SelectLang from '~/components/SelectLang/index.vue'
import { USER_INFO } from '~/store/mutation-types'

import {
  QuestionCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined
} from '@ant-design/icons-vue'

import { useStore } from 'vuex'

import ls from '~/utils/Storage'

import { isMobile } from '~/utils/device'
import { layoutMode } from '~/store/useSiteSettings'

import Logout from '~/components/tools/Logout.vue'

export default defineComponent({
  name: 'UserMenu',
  props: ['theme'],
  components: {
    NoticeIcon,
    SearchBar,
    DarkLightMode,
    QuestionCircleOutlined,
    SettingOutlined,
    LogoutOutlined,
    SelectLang,
    LockOutlined,
    layoutMode,
    Logout
  },
  setup (props) {

    const UserInfo = ls.get(USER_INFO)
    const store = useStore()

    const showSystemSetting = () => {
      store.commit('SET_SETTING_DRAWER', true)
    }

    const onLockScreen = () => {
      store.commit('SET_LOCK_SCREEN', true)
    }

    return {
      avatar: '/images/avatar.png',
      nickname: UserInfo ? UserInfo.first_name : '',

      showSystemSetting,
      onLockScreen,
      isMobile,
      layoutMode
    }
  }
})
</script>
<style lang="less">
.user-dropdown-menu-wrapper {
  .ant-dropdown-menu-item {
    width: 100% !important;
  }
}
</style>
