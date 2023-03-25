<template>
  <div class="rounded-md grid grow grid-nogutter">
    <Head>
      <Title>{{property.title}}</Title>
    </Head>

    <portal to="sub-top-menu" v-if="subTopMenus.length">
      <SubTopMenu :menu="subTopMenus" :collapsed="false" mode="horizontal"/>
    </portal>
    <div :class="`${subTopMenus.length ? 'with-top-menu': ''}`">
      <krud v-if="pageType === 'crud' && property.page_id != null" :template="property.template" :property="property" :base_url="property.base_url"/>
    </div>

    <div class="iframe-page" v-if="pageType === 'iframe'">
      <iframe :src="iframeUrl"></iframe>
    </div>
  </div>
</template>
<script>

import pageMixin from "~/mixins/page";
export default {
  mixins: [pageMixin],
}
</script>
