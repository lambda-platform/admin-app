<template>
  <button @click="handleLogout" class="link link-icon w-full " >
                 <span class="svg-icon ">
                      <inline-svg
                        src="/assets/icons/duotone/Interface/Sign-Out.svg"
                      />
                  </span>&nbsp;&nbsp;
    <span v-if="showTitle" >{{ $t('userMenu.logout')}}</span>
  </button>
</template>

<script lang="ts">
import Modal from "ant-design-vue/lib/modal"

import { defineComponent } from 'vue'
import { userLogout } from '~/service/service'
import { clearUserInfo } from '~/utils/util'
export default defineComponent({
  props: {

    showTitle: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const router = useRouter()
    const handleLogout = () => {

      Modal.confirm({
        title: proxy.$t('userMenu.logout'),
        content: proxy.$t('userMenu.checkLogout'),
        okText: proxy.$t('appAdmin.yes'),
        cancelText: proxy.$t('appAdmin.no'),
        onOk: () => {
          userLogout().then((res) => {
            clearUserInfo()
            router.push({ path: '/auth/login' })
          })
        },
        onCancel () {
        }
      })
    }


    return {
      handleLogout
    }
  }
})
</script>
