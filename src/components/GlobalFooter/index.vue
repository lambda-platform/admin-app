<template>
  <div class="footer ">
<!--    <div :class="['links',isMobile?'lessMargin':'']">-->
<!--      <a-->
<!--        href="https://lambda-platform.github.io/"-->
<!--        target="_blank"-->
<!--      >Lambda</a>-->
<!--      <a-->
<!--        href="https://github.com/lambda-platform/"-->
<!--        target="_blank"-->
<!--      >-->
<!--        <GithubOutlined />-->
<!--      </a>-->
<!--     -->
<!--    </div>-->
    <div class="copyright">
      <span class="text-gray-400">{{ copyright }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import { isMobile } from '~/utils/device'
import { LAMBDA_CONFIG } from '~/store/mutation-types'
import ls from "~/utils/Storage";
export default defineComponent({
  name: 'GlobalFooter',
  components: {
    CopyrightOutlined,
    GithubOutlined
  },
  setup() {

    const LambdaConfig = ls.get(LAMBDA_CONFIG)
    return {
      isMobile,
      copyright: LambdaConfig.copyright,
    }
  }
})
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 12px 0 12px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }

    &.lessMargin {
      a {
        &:not(:last-child) {
          margin-right: 20px;
        }
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
