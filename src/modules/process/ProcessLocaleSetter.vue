<template>
  <div></div>
</template>
<script setup>
import {onMounted} from "vue";
import axios from "axios";
import {i18n} from "~/locale/index.js"
async function fetchAndSetTranslations() {
  try {
    const response = await axios.get(`/process/translations`);
    const translations = response.data;

    let locales = {

    }
    translations.forEach(tw=>{
      if(!locales.hasOwnProperty(tw.locale)){
        locales[tw.locale] = {"process":{}}
      }

      locales[tw.locale]["process"][tw.key_word] = tw.form
      locales[tw.locale]["process"][tw.key_word+"_grid"] = tw.grid



    });

    Object.keys(locales).forEach(locale=>{
      i18n.global.mergeLocaleMessage(locale, locales[locale]);
    })



  } catch (error) {
    console.error("Error fetching or setting translations:", error);
  }
}
onMounted(()=>{
  fetchAndSetTranslations();
})
</script>
<style scoped lang="scss">

</style>
