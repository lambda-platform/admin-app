<template>
  <!--placement="bottomRight"
    :autoAdjustOverflow="false"
  :arrowPointAtCenter="true"-->
  <a-popover
    v-model:open="visible"
    trigger="click"
    :placement="isMobile?'bottom':'bottomRight'"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="getPopupContainer"
    :overlayStyle="{ width: isMobile?'250px':'300px', top: '50px' }"
  >
    <template #content>
      <a-spin :spinning="loading">
        <a-list>
          <a-list-item>
            <a-list-item-meta title="Та долоо хоног тутмын мэдэгдэл хүлээн авлаа" description="Мэдэгдэл">
              <a-avatar
                style="background-color: white"
                slot="avatar"
                src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
              />
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta title="Та долоо хоног тутмын мэдэгдэл хүлээн авлаа" description="Мэдэгдэл">
              <a-avatar
                style="background-color: white"
                slot="avatar"
                src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
              />
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta title="Та долоо хоног тутмын мэдэгдэл хүлээн авлаа" description="Мэдэгдэл">
              <a-avatar
                style="background-color: white"
                slot="avatar"
                src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
              />
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta title="Та долоо хоног тутмын мэдэгдэл хүлээн авлаа" description="Мэдэгдэл">
              <a-avatar
                style="background-color: white"
                slot="avatar"
                src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
              />
            </a-list-item-meta>
          </a-list-item>

        </a-list>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge count="12">


        <span class="btn btn-icon">
              <span class="svg-icon">

                      <inline-svg
                                  src="/assets/icons/duotune/general/gen007.svg"
                      />
              </span>
    </span>
      </a-badge>
    </span>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { isMobile } from '~/utils/device'

export default defineComponent({
  name: 'HeaderNotice',
  components: {
    BellOutlined
  },
  setup() {
    const loading = ref<boolean>(false)
    const visible = ref<boolean>(false)
    const noticeRef = ref(null)

    const fetchNotice = () => {
      if (!visible.value) {
        loading.value = true
        setTimeout(() => {
          loading.value = false
        }, 300)
      } else {
        loading.value = false
      }
      // visible.value = !visible.value;
    }

    const getPopupContainer = () => {
      return noticeRef.value!.parentElement
    }
    return {
      loading,
      visible,
      fetchNotice,
      noticeRef,
      getPopupContainer,
      isMobile
    }
  }
})
</script>

<style lang="css">
.header-notice-wrapper {
  top: 50px !important;
}
</style>
<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    // vertical-align: initial;
  }
}
</style>
